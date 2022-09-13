import './App.css';
import React from "react";

const Greeter = name => name + "Is Watching You";

const ShowList = ({showList, onRemoveItem}) =>
    showList.map(item => (
        <Item
            key={item.objectID}
            item={item}
            onRemoveItem={onRemoveItem}
        />
    ));

const Item = ({item, onRemoveItem}) =>
    <div>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <span> {item.author}</span>
        <span> {item.num_comments}</span>
        <span> {item.points}</span>
        <span>
            <button type="button" onClick={() => onRemoveItem(item)}>
                Dismiss
            </button>
        </span>
    </div>

const InputWithLabel = ({id, value, type = "text", onInputChange, isFocused, children}) => {
    //A
    const inputRef = React.useRef();

    //C
    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            //D
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}> {children} </label>
            &nbsp;
            <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange}/>
        </>
    )
}
//A
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

//Personal Hook
const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key]);

    return [value, setValue];
};

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'STORIES_FETCH_FAILURE':
            return{
                ...state,
                isLoading: false,
                isError: true,
            }
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter(story => action.payload.objectID !== story.objectID),
            };
        default:
            throw new Error();
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
    const [stories, dispatchStories] = React.useReducer(
        storiesReducer, {data: [], isLoading: false, isError: false}
    );

    React.useEffect(() => {
        dispatchStories({type: 'STORIES_FETCH_INIT'});

        fetch(`${API_ENDPOINT}react`)//B
            .then(response => response.json())//C
            .then(result => {
                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result.hits //D
                });
            })
            .catch(() => dispatchStories({type: 'STORIES_FETCH_FAILURE'}));
    }, []);

    const handleRemoveStory = item => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item
        })
    }

    const handleSearch = event => setSearchTerm(event.target.value);


    const searchedStories = stories.data.filter(story =>
        story.title.toLocaleLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="App">
            <h1> {Greeter("Konstantine")}</h1>

            <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch}>
                <strong> Search:</strong>
            </InputWithLabel>

            <>
                {stories.isError && <p>Something went wrong...</p>}

                {stories.isLoading ? (
                    <p>Loading...</p>
                ) : (
                    < ShowList
                        showList={searchedStories}
                        onRemoveItem={handleRemoveStory}
                    />
                )}
            </>
        </div>
    );
}
export default App;
