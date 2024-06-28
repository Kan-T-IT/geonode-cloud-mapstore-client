import React from 'react';
import PropTypes from 'prop-types';


const Table = ({head, body}) => {

    const hdlabels = head?.map( hdlabel => {
        return (
            hdlabel.value && <>
                <th>{hdlabel.value}</th>
            </>

        );
    });

    const bdData = body?.map((row) =>{
        return (
            <tr>
                {head.map(function(column) {
                    return <td>{row[column.key]}</td>;
                })}
            </tr>);
    });


    return (
        <table className="table">
            <thead>
                <tr>
                    {hdlabels}
                </tr>
            </thead>
            <tbody>
                {bdData}
            </tbody>
        </table>
    );
};


Table.propTypes = {
    head: PropTypes.array,
    body: PropTypes.array
};

Table.defaultProps = {
    head: [],
    body: []
};


export default Table;
