const SearchBar = ({ search, setSearch, category, setCategory }) => {
    const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert", "Beverages"];
    return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
                type="text" 
                placeholder="Search recipes..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '8px', width: '300px' }}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px' }}>
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>
    );
};

export default SearchBar;