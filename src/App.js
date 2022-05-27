import { useEffect, useMemo, useState } from 'react'
import CSVReader from 'react-csv-reader'
import './App.css'
import FilterComponent from './components/FilterComponent'
import Table from './components/Table'

function App() {
  const [csvData, setCsvData] = useState([])
  const [filters, setFilters] = useState([])
  const [fileInfo, setFileInfo] = useState({})

  const handleForce = (data, fileInfo) => {
    setCsvData(data)
    setFileInfo(fileInfo)
    sessionStorage.setItem('csvData', JSON.stringify(data))
  }

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, '_')
  }

  useEffect(() => {
    let data = filters.length
      ? JSON.parse(sessionStorage.getItem('csvData'))
      : [...csvData]

    filters.forEach((filter) => {
      data = [...data]
      const filteringValue =
        filter.type === 'text' ? filter.value.toLowerCase() : filter.value

      if (filteringValue) {
        switch (filter.condition) {
          case 'contains':
            data = data
              .filter((row) =>
                filter.column === 'name'
                  ? row['first_name'].toLowerCase().includes(filteringValue) ||
                    row['last_name'].toLowerCase().includes(filteringValue)
                  : row[filter.column].toLowerCase().includes(filteringValue)
              )
              .map((item) => item)
            break

          case 'notContains':
            data = data
              .filter((row) =>
                filter.column === 'name'
                  ? !row['first_name'].toLowerCase().includes(filteringValue) ||
                    !row['last_name'].toLowerCase().includes(filteringValue)
                  : !row[filter.column].toLowerCase().includes(filteringValue)
              )
              .map((item) => item)
            break

          case 'equalTo':
            data = data
              .filter((row) => row[filter.column] === Number(filteringValue))
              .map((item) => item)
            break

          case 'notEqualTo':
            data = data
              .filter((row) => row[filter.column] !== Number(filteringValue))
              .map((item) => item)
            break

          case 'greaterThan':
            data = data
              .filter((row) => row[filter.column] > Number(filteringValue))
              .map((item) => item)
            break

          case 'lessThan':
            data = data
              .filter((row) => row[filter.column] < Number(filteringValue))
              .map((item) => item)
            break

          default:
            break
        }
      }
    })

    setCsvData(
      filters.length
        ? [...data]
        : sessionStorage.getItem('csvData') !== null
        ? JSON.parse(sessionStorage.getItem('csvData'))
        : []
    )
  }, [filters])

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Name',
        Cell: (row) => {
          return (
            <span>{`${row.row.original.first_name} ${row.row.original.last_name}`}</span>
          )
        }
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Spend',
        accessor: 'price'
      },
      {
        Header: 'Total Spend',
        accessor: 'total_spend'
      }
    ],
    []
  )

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8 space-y-3">
      <CSVReader
        cssClass="react-csv-input"
        label=""
        onFileLoaded={handleForce}
        parserOptions={papaparseOptions}
      />

      {fileInfo !== {} && <FilterComponent setFilters={setFilters} />}

      <Table columns={columns} data={csvData} />
    </div>
  )
}

export default App
