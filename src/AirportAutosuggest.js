import React from "react";
import Autosuggest from 'react-autosuggest';
import './AirportAutosuggest.css';
import airports from './airports.json';


function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return airports.filter(data => regex.test(data.name));
}

function getSuggestionValue(suggestion) {
    return suggestion.name;
}

function renderSuggestion(suggestion) {
    return (
        <span>
            {suggestion.name}
        </span>
    );
}

export default class AirportAutosuggest extends React.Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: []
        };
    }

    onChange = (_, {newValue}) => {
        const {id, onChange} = this.props;
        // debugger
        this.setState({value: newValue});

        // onChange(id, newValue);
    };

    onSuggestionsFetchRequested = ({value}) => {
        this.setState({suggestions: getSuggestions(value)});
    };

    onSuggestionsClearRequested = () => {
        this.setState({suggestions: []});
    };

    render() {
        const {id, placeholder} = this.props;
        const {value, suggestions} = this.state;
        const inputProps = {
            className: 'form-control',
            placeholder,
            value,
            onChange: this.onChange
        };

        return (<Autosuggest
            id={id}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
                this.props.onChange(id, suggestion)
            }} 
 
            />);
    }
}