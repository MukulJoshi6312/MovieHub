/* eslint-disable react/prop-types */

const Search = ({searchSTerm,setSearchTerm}) => {
  return (
    <div className="search">
        <div>
            <img src="search.svg" alt="search " />
            <input type="text" placeholder="Serahc through thousands of movies"
            value={searchSTerm}
            onChange={(e)=>setSearchTerm(e.target.value)} />
        </div>
    </div>
  )
}

export default Search
