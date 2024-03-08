import React, { useState, useEffect } from "react";
import { useSelector, connect } from "react-redux";
import Table from 'react-bootstrap/Table';
import '../App.css';
import {
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Container
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#000000"
    },
    table: {
        minWidth: 300,
        [theme.breakpoints.up('md')]: {
            minWidth: 500,
        },
    },
    formControl: {
        [theme.breakpoints.down('sm')]: {
            minWidth: 100,
            margin: 5,
            borderRadius: 10
        },
        [theme.breakpoints.up('md')]: {
            minWidth: 120,
            margin: 10,
            borderRadius: 10
        },
    },
    button: {
        [theme.breakpoints.down('sm')]: {
            height: 50,
            marginTop: 8,
            borderRadius: 10
        },
        [theme.breakpoints.up('md')]: {
            height: 50,
            marginTop: 12,
            borderRadius: 10
        },
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        [theme.breakpoints.down('sm')]: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.black,
            fontSize: 30
        },
        [theme.breakpoints.down('md')]: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.black,
            fontSize: 20
        }
    },
    body: {
        fontSize: 18,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const App = (props) => {
    const dataStore = useSelector((state) => state.Data);
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    /*display API data*/
    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/albums")
            .then((response) => response.json())
            .then((responseData) => {
                props.reducerData(responseData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setData(dataStore[0] || []);
    }, [dataStore]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // search change //

    const handleSortChange = (event) => {
        setSortColumn(event.target.value);/*sorting change*/
    };

    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedData = data.sort((a, b) => {
        if (sortColumn) {
            const columnA = a[sortColumn];
            const columnB = b[sortColumn];
            if (columnA < columnB) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (columnA > columnB) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        }
        return 0;
    });    /*sorted data*/

    const filteredData = sortedData.filter((row) => {
        return typeof row.title === 'string' && row.title.toLowerCase().includes(searchQuery.toLowerCase());
    });    /*filtered data*/

    const Header = () => {
        return (
            <header className="header">
                <h1 className="header-text">Albums</h1>
            </header>
        );
    };

    const Footer = () => {
        return (
            <footer className="footer">
                <h1 className="header-text">@copyright</h1>
            </footer>
        );
    };

    return (
        <div className="App">
            <Header />
            <div>
                {/* search text field */}
                <TextField
                    label="Search"
                    id="filled-password-input"
                    variant="filled"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={classes.formControl}
                    style={{ backgroundColor: 'white', borderRadius: 10 }}
                />
                {/* sort field */}
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel htmlFor="my-input">sort by</InputLabel>
                    <Select
                        value={sortColumn || ''}
                        onChange={handleSortChange}
                        style={{ backgroundColor: 'white' }}
                    >
                        <MenuItem value="id">Id</MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                        <MenuItem value="userId">User Id</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={handleSortOrderChange} variant="contained" color="primary" className={classes.button}>
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
            </div>
            <Container className={classes.container}>
                <TableContainer style={{ margin: "auto", display: "flex", justifyContent: "center" }}>
                    <Table className={`${classes.table} table-custom`} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Id</StyledTableCell>
                                <StyledTableCell align="center">Title</StyledTableCell>
                                <StyledTableCell align="center">User Id</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row) => {
                                return (
                                    <StyledTableRow align="center" key={row.id}> {/* Changed key to row.id */}
                                        <StyledTableCell component="th" scope="row">{row.id}</StyledTableCell>
                                        <StyledTableCell align="center">{row.title}</StyledTableCell>
                                        <StyledTableCell align="center">{row.userId}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Container>
            <Footer />
        </div>
    );
};

const mapStateToProps = (props) => {
    return {
        data: props.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        reducerData(data) {
            dispatch({ type: "DATA_FETCH", data });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);