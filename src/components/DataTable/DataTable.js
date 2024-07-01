import React, { useMemo } from 'react';

import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';

const DataTable = ({columns, data, ...options}) => {

  const Header = useMemo(() => (
    <TableHead>
      <TableRow>
        {columns.map((col, index) => (
          <TableCell key={`header-${index}`} sx={{width: col.width}}>{col?.title}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  ), [columns]);

  const Body = useMemo(() => (
    <TableBody>
      {data.map((row, rindex) => (
        <TableRow
          key={`row-${rindex}`}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          {columns.map((col, cindex) => (
            <TableCell key={`cell-${rindex}-${cindex}`} sx={{width: col.width}}>
              { col?.field ? row[col.field] : col?.cellTemplate(row) }
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  ), [columns, data]);

  return (
    <TableContainer component={Paper}>
      <Table {...options}>
        { Header }
        { Body }
      </Table>
    </TableContainer>
  )
};

export default DataTable;