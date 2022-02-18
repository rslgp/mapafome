import React, { Component } from 'react';
import Typography from '@mui/material/Typography';

class TableCount extends Component {
    render() {
        return (
            <Typography className="TableCount">
                TOTAL: {this.props.rowCountProp}
            </Typography>
        );
    }
}

export default TableCount;