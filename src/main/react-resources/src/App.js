import './App.css';
import React from "react";

const Greeter = name => name + "Is Watching You";

const ShowList = prop =>
    prop.showList.map(({objectID, ...item}) => (
        <Item
            key={objectID}
            {...item}
        />
    ));

const Item = ({url, title, author, num_comments, points}) =>
    <div>
        <span>
            <a href={url}>{title}</a>
        </span>
        <span> {author}</span>
        <span> {num_comments}</span>
        <span> {points}</span>
    </div>


const Search = ({search, onSearch}) =>
    <>
        <label htmlFor={"Search"}> search </label>
        <input id={"Search"} type={"text"} value={search} onChange={onSearch}/>
        <hr/>
    </>

const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key]);

    return [value, setValue];
};

const App = () => {
    const stories = [
        {
            title: 'React',
            url: 'https://reactjs.org/',
            author: 'Jordan Walke',
            num_comments: 3,
            points: 4,
            objectID: 0,
        },
        {
            title: 'Redux',
            url: 'https://redux.js.org/',
            author: 'Dan Abramov, Andrew Clark',
            num_comments: 2,
            points: 5,
            objectID: 1,
        },
    ];

    const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };

    const searchedStories = stories.filter(story =>
        story.title.toLocaleLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="App">
            <h1> {Greeter("Konstantine")}</h1>

            <Search search={searchTerm} onSearch={handleSearch}/>

            < ShowList showList={searchedStories}/> <br/>
        </div>
    );
}
export default App;
