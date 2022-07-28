import './App.css';
import React from "react";

const Greeter = name => name + "Is Watching You";

const ShowList = ({showList}) =>
    showList.map(({objectID, ...item}) => (
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

const InputWithLabel = ({id, label, type="text", value, onInputChange}) =>
    <>
        <label htmlFor={id}> {label} </label>
        <input id={id} type={type} value={value} onChange={onInputChange}/>
    </>

//Personal Hook
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
        }
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

            <InputWithLabel id="search" label="Search" value={searchTerm} onInputChange={handleSearch}/>

            < ShowList showList={searchedStories}/> <br/>
        </div>
    );
}
export default App;
