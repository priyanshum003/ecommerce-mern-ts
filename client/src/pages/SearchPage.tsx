import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterOptions from '../components/common/FilterOptions';
import { useCategoriesQuery, useSearchProductsQuery } from '../redux/api/product.api';
import ReactPaginate from 'react-paginate';
import { Product } from '../types/api-types';
import ProductCard from '../components/ProductCard';

const SearchPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [sort, setSort] = useState<'asc' | 'desc' | 'relevance'>('relevance');
    const [page, setPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        if (query) {
            setSearchTerm(query);
            setIsSearching(true);
        }
    }, [query]);

    const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useCategoriesQuery('');
    const { data, isLoading, isError, refetch } = useSearchProductsQuery({
        search: searchTerm,
        category: selectedCategory || undefined,
        price: minPrice !== undefined && maxPrice !== undefined ? `${minPrice},${maxPrice}` : undefined,
        sort: sort !== 'relevance' ? sort : undefined,
        page,
    }, {
        skip: !isSearching
    });

    useEffect(() => {
        if (isSearching) {
            refetch();
        }
    }, [searchTerm, selectedCategory, minPrice, maxPrice, sort, page, isSearching, refetch]);

    const onSearch = () => {
        setPage(1);
        setIsSearching(true);
        refetch();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setSort('relevance');
        setPage(1);
        setIsSearching(false);
    };

    const handlePageClick = (selectedItem: { selected: number }) => {
        setPage(selectedItem.selected + 1);
    };

    return (
        <div className="container mx-auto px-4 ">
            <div className="flex flex-col lg:flex-row min-h-[80vh]">
                <div className="lg:w-1/4 p-4">
                    {categoriesLoading ? (
                        <p>Loading categories...</p>
                    ) : categoriesError ? (
                        <p>Error loading categories.</p>
                    ) : (
                        <FilterOptions
                            categories={categoriesData?.categories || []}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            minPrice={minPrice}
                            setMinPrice={setMinPrice}
                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}
                            sort={sort}
                            setSort={setSort}
                            clearFilters={clearFilters}
                        />
                    )}
                </div>
                <div className="w-full lg:w-3/4 p-4 border-l shadow-sm rounded-md">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} />

                    {isSearching ? (
                        isLoading ? (
                            <p>Loading...</p>
                        ) : isError ? (
                            <p>Error loading products.</p>
                        ) : data?.products.length === 0 ? (
                            <p>No products found.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {data?.products.map((product: Product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                                {data && data.totalPage > 1 && (
                                    <ReactPaginate
                                        pageCount={data.totalPage}
                                        pageRangeDisplayed={2}
                                        marginPagesDisplayed={2}
                                        onPageChange={handlePageClick}
                                        containerClassName="pagination flex justify-center mt-4"
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link px-3 py-2 border rounded-md"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link px-3 py-2 border rounded-md"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link px-3 py-2 border rounded-md"
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link px-3 py-2 border rounded-md"
                                        activeClassName="bg-blue-500 text-white"
                                        disabledClassName="text-gray-400"
                                    />
                                )}
                            </>
                        )
                    ) : (
                        <p className='text-center'>Please enter a search term to find products.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
