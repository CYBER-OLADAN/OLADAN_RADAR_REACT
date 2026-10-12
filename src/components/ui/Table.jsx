import React from "react";

const Table = ({ columns, rows, className, ...props }) => {
  const headerRow = (
    <tr>
      {columns.map((column) => (
        <th key={column.id} className="table-header">
          {column.title}
        </th>
      ))}
    </tr>
  );

  const rowElements = rows.map((row, rowIndex) => (
    <tr key={rowIndex} className="table-row">
      {columns.map((column) => {
        const value = row[column.id];
        return (
          <td key={`${column.id}-${rowIndex}`} className="table-cell">
            {value !== undefined ? value : "-"}
          </td>
        );
      })}
    </tr>
  ));

  return (
    <div className={`table-wrapper ${className || ""}`} {...props}>
      <table>
        <thead>{headerRow}</thead>
        <tbody>{rowElements}</tbody>
      </table>
    </div>
  );
};

Table.defaultProps = {
  columns: [],
  rows: [],
};

export default Table;
export function Table({ columns, rows, className, ...props }) {
  const headerRow = (
    <tr>
      {columns.map((column) => (
        <th key={column.id} className="table-header">
          {column.title}
        </th>
      ))}
    </tr>
  );

  const rowElements = rows.map((row, rowIndex) => (
    <tr key={rowIndex} className="table-row">
      {columns.map((column) => {
        const value = row[column.id];
        return (
          <td key={`${column.id}-${rowIndex}`} className="table-cell">
            {value !== undefined ? value : "-"}
          </td>
        );
      })}
    </tr>
  ));

  return (
    <div className={`table-wrapper ${className || ""}`} {...props}>
      <table>
        <thead>{headerRow}</thead>
        <tbody>{rowElements}</tbody>
      </table>
    </div>
  );
}