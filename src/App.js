import React, {useState} from "react";

import logo from './logo.svg';
import './App.css';
import './firework.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AirportAutosuggest from './AirportAutosuggest';

import 'bootstrap/dist/css/bootstrap.min.css';
import TimeRangeSlider from 'react-time-range-slider';
import classNames from 'classnames';

import {
    Progress,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import useInterval from './useInterval';
import AudioPlayer from "react-h5-audio-player";

import {withGoogleMap, GoogleMap, Marker, Polyline} from "react-google-maps";

function Ticket({ticketInfo, doRedirect}) {

    return (
        <div
            className="p-2 mb-2 border d-flex ticket"
            style={{
                display: "block"
            }}>
            {/*"occasional inline style rule"*/}
            <div className="h-100 flex-column col-2">
                <button
                    onClick={doRedirect}
                    type="button"
                    className="mb-auto btn btn-warning btn-lg w-100">Buy for {ticketInfo.price}$
                </button>
                <div className="">
                    {ticketInfo
                        .alternatives
                        .map(alternative => {
                            return (
                                <a
                                    href="#"
                                    onClick={doRedirect}
                                    key={alternative.name}
                                    className="p-1 d-flex justify-content-between align-items-center">
                                    {alternative.name}&nbsp;<span
                                    className="badge badge-primary badge-pill">{alternative.price}&nbsp;{ticketInfo.currency}
                  </span>
                                </a>
                            )
                        })}

                </div>
            </div>
            <div className="d-flex justify-content-between w-100">
                <div className="align-self-center">
                    <div>
                        <b>{ticketInfo.departure.time}</b>
                    </div>
                    <div>{ticketInfo.departure.city}</div>
                    <div>{ticketInfo.departure.date}</div>
                </div>
                <div className="align-self-center">
                    Travel time
                    <b>{ticketInfo.travelTime}</b>
                </div>
                <div className="align-self-center">
                    <div>
                        <b>{ticketInfo.arrival.time}</b>
                    </div>
                    <div>{ticketInfo.arrival.city}</div>
                    <div>{ticketInfo.arrival.date}</div>
                </div>
            </div>
        </div>
    );
};

function SearchForm({onSubmit}) {
    const [startDate,
        setStartDate] = useState(new Date());
    const [endDate,
        setEndDate] = useState(new Date());

    const [origin,
        setOrigin] = useState({});
    const [destination,
        setDestination] = useState({});

    function isObject(obj) {
        return obj === Object(obj);
    }

    return (
        <div className="h-100">
            <form className="mb-1 shadow-sm form debug d-flex justify-content-center"
                  onSubmit={(e) => onSubmit() && e.stopPropagation()}>
                <div className="form-group col">
                    <div className="d-flex flex-column">
                        <label htmlFor="origin">Origin</label>
                        <AirportAutosuggest
                            id="origin"
                            required
                            onChange={(id, newVal) => setOrigin(newVal)}
                            placeholder="Enter origin"/>
                    </div>
                </div>

                <div className="form-group col">
                    <div className="d-flex flex-column">
                        <label htmlFor="destination">Destination</label>
                        <AirportAutosuggest
                            id="destination"
                            onChange={(id, newVal) => setDestination(newVal)}
                            placeholder="Enter destination"/>
                    </div>
                </div>

                <div className="form-group col">
                    <div className="d-flex flex-column">
                        <label htmlFor="depart-date">Depart date</label>
                        <DatePicker
                            className="form-control"
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}/>
                    </div>
                </div>

                <div className="form-group col">
                    <div className="d-flex flex-column">
                        <label htmlFor="return-date">Return date</label>
                        <DatePicker
                            className="form-control"
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            endDate={endDate}
                            minDate={startDate}/>
                    </div>
                </div>

                <div className="form-group col">
                    <div className="d-flex flex-column">
                        <label htmlFor="cabin-class">Cabin class</label>
                        <select className="form-control" id="cabin-class" className="custom-select">
                            <option value="economy">Economy</option>
                            <option value="business">Business</option>
                            <option value="first">First class</option>
                        </select>
                    </div>
                </div>

                <div className="form-group col">
                    <div className="d-flex flex-column">
                        <label htmlFor="adults">Adults</label>
                        <input
                            className="form-control"
                            type="number"
                            name="adults"
                            min={1}
                            max={10}
                            defaultValue={1}/>
                    </div>
                </div>

                <div className="form-group col">
                    <div className="d-flex flex-column">
                        <label htmlFor="submit">&nbsp;</label>
                        <button
                            type="submit"
                            id="submit"
                            className="btn btn-success">Search
                        </button>
                    </div>
                </div>
            </form>
            <MapWithAMarker
                containerElement={< div style={{height: `600px`}}/>}
                mapElement={< div style={{height: `100%`}}/>}
                origin={origin}
                destination={destination}/>
        </div>

    );
}

function Filters() {
    const [departTime,
        setDepartTime] = useState({start: "00:00", end: "23:59"});

    const [returnTime,
        setReturnTime] = useState({start: "00:00", end: "23:59"});
    return (
        <section>
            <form>
                <fieldset className="border p-3 shadow-sm">
                    <legend className="w-auto">Layovers count</legend>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="stops-all"
                            defaultChecked={true}/>
                        <label className="form-check-label" htmlFor="stops-all">
                            All
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="stops-direct"/>
                        <label className="form-check-label" htmlFor="stops-direct">
                            Direct flight
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="stops-1"/>
                        <label className="form-check-label" htmlFor="stops-1">
                            1 stop
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="stops-2"/>
                        <label className="form-check-label" htmlFor="stops-2">
                            2 stops
                        </label>
                    </div>

                </fieldset>

                <fieldset className="border p-3 shadow-sm">
                    <legend className="w-auto">Departure time</legend>

                    <div className="form-group">
                        <div className="d-flex justify-content-between">
                            <b>{departTime.start}</b>
                            <b>{departTime.end}</b>
                        </div>
                        <TimeRangeSlider
                            disabled={false}
                            format={24}
                            maxValue={"23:59"}
                            minValue={"00:00"}
                            name={"time_range"}
                            onChange={setDepartTime}
                            step={15}
                            value={departTime}/>
                    </div>

                </fieldset>

                <fieldset className="border p-3 shadow-sm">
                    <legend className="w-auto">Return time</legend>

                    <div className="form-group">
                        <div className="d-flex justify-content-between">
                            <b>{returnTime.start}</b>
                            <b>{returnTime.end}</b>
                        </div>
                        <TimeRangeSlider
                            disabled={false}
                            format={24}
                            maxValue={"23:59"}
                            minValue={"00:00"}
                            name={"time_range"}
                            onChange={setReturnTime}
                            step={15}
                            value={returnTime}/>
                    </div>
                </fieldset>
            </form>
        </section>
    );
}

function SearchResults({doRedirect}) {
    let ticketInfo = {
        currency: '$',
        travelTime: '2 hours 20 minutes',
        price: 100,
        departure: {
            time: '12:00',
            date: '2019-12-12',
            city: 'Singapore'
        },
        arrival: {
            time: '15:30',
            date: '2019-12-12',
            city: 'Phuket'
        },
        alternatives: [
            {
                name: 'Jetstar',
                price: 199
            }, {
                name: 'Airasia',
                price: 200
            }, {
                name: 'Scoot',
                price: 250
            }
        ]
    };
    return Array
        .from('x'.repeat(5))
        .map((x, i) => <Ticket doRedirect={doRedirect} key={i} ticketInfo={ticketInfo}/>);
}

function Preroll() {
    const [progres,
        setProgres] = useState(0);
    //simulate activity
    useInterval(() => {
        setProgres(progres + 1);
    }, progres < 100
        ? 300
        : null);

    return (
        <div className="shadow-lg p-3 w-50 ml-auto mr-auto">
            <h1>Searching tickets</h1>
            <div className="text-center">{progres}%</div>
            <Progress max={100} animated value={progres}/>
        </div>
    );
}

function BookingAgencyWebsite() {
    return (
        <div className="border shadow-sm">
            <h1>Hello, this is ticket booking agency website</h1>
            <h2>Here is table with some information with prices</h2>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

const MapWithAMarker = withGoogleMap(({origin, destination}) => {

    const isValid = (obj) => {

        return "lat" in obj && "lon" in obj
    };

    const originValid = isValid(origin);
    const destinationValid = isValid(destination);

    return (
        <GoogleMap
            defaultZoom={2}
            defaultCenter={{
                lat: 1.290270,
                lng: 103.851959
            }}>
            {isValid(origin)
                ? (<Marker
                    position={{
                        lat: parseFloat(origin.lat),
                        lng: parseFloat(origin.lon)
                    }}/>)
                : null
            }

            {isValid(destination)
                ? (<Marker
                    position={{
                        lat: parseFloat(destination.lat),
                        lng: parseFloat(destination.lon)
                    }}/>)
                : null
            }

            {originValid && destinationValid
                ? <Polyline
                    path={[
                        {
                            lat: parseFloat(origin.lat),
                            lng: parseFloat(origin.lon)
                        }, {
                            lat: parseFloat(destination.lat),
                            lng: parseFloat(destination.lon)
                        }
                    ]}/>
                : null
            }
        </GoogleMap>
    );
});

function Redirect() {
    const [progres,
        setProgres] = useState(0);
    //simulate activity
    useInterval(() => {
        setProgres(progres + 1);
    }, progres < 100
        ? 300
        : null);

    return (
        <div className="shadow-lg p-3 w-50 ml-auto mr-auto">
            <h1>Please wait, redirecting you to booking agency web site</h1>
            <div className="text-center">{progres}%</div>
            <Progress max={100} animated value={progres}/>
        </div>
    );
}

function CalculateResults(){
  const tasks = [
    ["Use of HTML5 structural elements such as header, footer, nav, article and section, instead of div", 2],
    ["Correct use of nav and ul for navigational menu", 2],
    ["Correct use of hyperlinks (both absolute and relative)", 2],
    ["Demonstrated competent use of other HTML elements such as table, ol etc,", 2],
    ["Provide adequate comments", 2],
    ["Use of embedded style sheets with the occasional inline style rules", 2],
    ["Use of CSS for background image, fonts and colours", 2],
    ["Demonstrated the application of the CSS box model (margin, border, padding, content)", 4],
    ["Use of CSS framework such as Bootstrap or Foundation", 2],
    ["Displays at least 5 images",2],
    ["Displays at least 2 videos",2],
    ["Loads at least 1 music file",2],
    ["Use of other web APIs such as Google Maps",2],
    ["Use of CSS or JS image slider/gallery",2],
    ["Complete web form of at least 3 different types of fields (text fields, textarea, radio buttons, checkboxes, buttons)",2],
    ["Perform form validation such as required fields",3],
    ["A response on submitting the form",1],
    ["Use of javascript function for example in web form",1],
    ["Uploaded to a webhost and be a “live” website with shortened URL (goo.gl)",2],
    ["Neat folder structure with separate folders for CSS, JS and assets",1]
  ];

  const [progres, setProgres] = useState(0);
  const isDone =  tasks.length <= progres;
  useInterval(() => {
    setProgres(progres + 1);
}, isDone ? null : 300);


  const prog = 100 / tasks.length  * progres;

  const tasksDone = [];
  let score = 0;

  for (let i =0; i < progres; i++) {
    const task = tasks[i];
    score+= task[1];
    tasksDone.push(<li key={i} className="small list-group-item d-flex justify-content-between align-items-center">
    {task[0]}
    <span className="badge badge-primary badge-pill">{task[1]}</span>
  </li>);
  }
  return (<div className="w-50 mr-auto ml-auto align-items-center">
          <h1>Score is {score}</h1>
          {isDone ? (
            <div className="pyro">
            <div className="before"></div>
            <div className="after"></div>
          </div>): null}
            <div className="text-center">Calculating... {prog}%</div>
            <Progress max={100} animated value={prog}/>

            <ul className="list-group">
              {tasksDone}
            </ul>

  </div>);
}

export default class Example extends React.Component {

    constructor(props) {
        super(props);
        //default state initialisation
        this.state = {
            showResultsIsVisible: false,
            navBarIsOpen: false,
            searchFormVisible: true,
            searchResultsVisible: false,
            prerollIsVisible: false,
            redirectIsVisible: false,
            agencyWebsiteIsVidible: false
        };
    }

    finishRedirect = () => {
        this.setState({redirectIsVisible: false, agencyWebsiteIsVidible: true, searchFormVisible: false});
    }

    doRedirect = () => {
        this.setState({redirectIsVisible: true, searchResultsVisible: false, searchFormVisible: false});
        setTimeout(this.finishRedirect, 5000);
    }
    finishSearch = () => {
        this.setState({prerollIsVisible: false, searchResultsVisible: true});
    }

    startSearch = () => {
        this.setState({prerollIsVisible: true, searchResultsVisible: false, searchFormVisible: false});
        setTimeout(this.finishSearch, 5000);
    }
    //toggle navbar
    toggle = () => {
        this.setState({
            navBarIsOpen: !this.state.navBarIsOpen
        });
    }
    showResults = () => {
      this.setState({
        showResultsIsVisible: true
      });
    }

    render() {
        //main render routine
        const {
            navBarIsOpen,
            searchFormVisible,
            searchResultsVisible,
            prerollIsVisible,
            redirectIsVisible,
            agencyWebsiteIsVidible,
            showResultsIsVisible
        } = this.state;
        if (showResultsIsVisible) {
          return <CalculateResults />;
        }

        return agencyWebsiteIsVidible
            ? <BookingAgencyWebsite/>
            : (
                <div className="h-100">
                    <header>
                        <Navbar color="light" light expand="md">
                            <NavbarBrand href="/">Search tickets</NavbarBrand>
                            <NavbarToggler onClick={this.toggle}/>
                            <Collapse isOpen={navBarIsOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <NavLink href="https://github.com/nurikk/IMI_ASSIGNMENT_2">GitHub</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink href="#" onClick={this.showResults}><b>Assesment score</b></NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink href="./assesment-points.html">Assesment required stuff</NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            Super interesting DropdownMenu
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>
                                                Nothing is here
                                            </DropdownItem>
                                            <DropdownItem>
                                                Nothing is here
                                            </DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>
                                                Nothing is here
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </Collapse>
                        </Navbar>
                    </header>
                    {searchFormVisible
                        ? <SearchForm onSubmit={this.startSearch}/>
                        : null}

                    {prerollIsVisible
                        ? <Preroll/>
                        : null}

                    {redirectIsVisible
                        ? <Redirect/>
                        : null}
                    <article
                        className={classNames("debug container-fluid", {
                            "d-none": !searchResultsVisible
                        })}>
                        <div className="row">
                            <div className="filters col-2">
                                <Filters/>
                            </div>
                            <div className="debug tickets col">
                                <SearchResults doRedirect={this.doRedirect}/>
                            </div>
                        </div>
                    </article>
                </div>
            );
    }
};
