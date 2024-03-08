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
        flexDirection: "column"
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
        },
        [theme.breakpoints.up('md')]: {
            minWidth: 120,
            margin: 10,
        },
    },
    button: {
        [theme.breakpoints.down('sm')]: {
            height: 40,
            marginTop: 8,
        },
        [theme.breakpoints.up('md')]: {
            height: 50,
            marginTop: 12,
        },
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontSize: 16
    },
    body: {
        fontSize: 14,
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

    const handleSortChange = (event) => {
        setSortColumn(event.target.value);
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
    });

    const filteredData = sortedData.filter((row) => {
        return typeof row.title === 'string' && row.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const Header = () => {
        return (
            <header>
                <h1>Albums</h1>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={classes.formControl}
                />
            </header>
        );
    };

    const Footer = () => {
        return (
            <footer>
                <p>@copyright</p>
            </footer>
        );
    };

    return (
        <div className="App">
            <Header/>
            <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="my-input">sort by</InputLabel>
                    <Select
                        value={sortColumn || ''}
                        onChange={handleSortChange}
                    >
                        <MenuItem value="id">Id</MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                        <MenuItem value="userId">User Id</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={handleSortOrderChange} variant="contained" color="primary" className={classes.button}>
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
            <Container className={classes.container}>
                <TableContainer style={{ margin: "auto" }}>
                    <Table className={classes.table} aria-label="simple table">
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
            <Footer/>
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