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
  Container
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  table: {
    minWidth: 300,
    [theme.breakpoints.up('md')]: {
      minWidth: 500,
    },
  }
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
    setData(dataStore[0]);
  }, [dataStore]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((row) => {
    return typeof row.title === 'string' && row.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="App">
      <header>
        <h1>Albums</h1>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ margin: "10px" }}
        />
      </header>
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
                  <StyledTableRow align="center" key={row.name}>
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
      <footer>
        <p>@copyright</p>
      </footer>
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
