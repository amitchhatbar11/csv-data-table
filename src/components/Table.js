import React from 'react'
import { useTable, usePagination } from 'react-table'

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 50 }
    },
    usePagination
  )

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table
              {...getTableProps()}
              border="1"
              className="min-w-full divide-y divide-gray-300"
            >
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-3 py-4 text-left text-sm font-bold text-gray-900 capitalize"
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="divide-y divide-gray-200 bg-white"
              >
                {page.map((row, i) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="whitespace-nowrap px-3 py-4 text-sm text-black-500"
                          >
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!!data.length && (
              <div className="flex justify-end space-x-3 mr-3">
                <button
                  className={`text-lg font-extrabold ${
                    !canPreviousPage ? 'text-gray-500' : 'text-blue-600'
                  }`}
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  {'First Page'}
                </button>{' '}
                <button
                  onClick={() => previousPage()}
                  className={`text-lg font-extrabold ${
                    !canPreviousPage ? 'text-gray-500' : 'text-blue-400'
                  }`}
                  disabled={!canPreviousPage}
                >
                  {'Previous'}
                </button>{' '}
                <button
                  onClick={() => nextPage()}
                  className={`text-lg font-extrabold ${
                    !canNextPage ? 'text-gray-500' : 'text-blue-400'
                  }`}
                  disabled={!canNextPage}
                >
                  {'Next'}
                </button>{' '}
                <button
                  className={`text-lg  font-extrabold ${
                    !canNextPage ? 'text-gray-500' : 'text-blue-600'
                  }`}
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {'Last Page'}
                </button>{' '}
                <span>
                  Page{' '}
                  <strong>
                    {state.pageIndex + 1} of {pageOptions.length}
                  </strong>{' '}
                </span>
                <select
                  value={state.pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                  }}
                >
                  {[50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      {data.length === 0 && (
        <div className="text-center m-10">Load CSV data</div>
      )}
    </div>
  )
}

export default Table
