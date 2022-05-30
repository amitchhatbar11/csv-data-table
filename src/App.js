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
        filter.type === 'string' ? filter.value.toLowerCase() : filter.value

      if (filteringValue) {
        switch (filter.condition) {
          case 'contains':
            data =
              data
                .filter((row) =>
                  row[filter.column].toLowerCase().includes(filteringValue)
                )
                .map((item) => item) || []

            break

          case 'notContains':
            data =
              data
                .filter(
                  (row) =>
                    !row[filter.column].toLowerCase().includes(filteringValue)
                )
                .map((item) => item) || []
            break

          case 'equalTo':
            data =
              data
                .filter((row) => row[filter.column] === Number(filteringValue))
                .map((item) => item) || []
            break

          case 'notEqualTo':
            data =
              data
                .filter((row) => row[filter.column] !== Number(filteringValue))
                .map((item) => item) || []
            break

          case 'greaterThan':
            data =
              data
                .filter((row) => row[filter.column] > Number(filteringValue))
                .map((item) => item) || []
            break

          case 'lessThan':
            data =
              data
                .filter((row) => row[filter.column] < Number(filteringValue))
                .map((item) => item) || []
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

  const headers = Object.keys(Object.assign({}, ...csvData))
  let typesOfColumns =
    csvData.length &&
    Object.entries(csvData[1]).map(([key, value]) => {
      return { key, type: typeof value }
    })

  const tableColumns = headers.map((header) => {
    return { Header: header.replace(/_/g, ' '), accessor: header }
  })

  const columns = useMemo(() => tableColumns, [tableColumns])

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8 space-y-3">
      <div className="mb-4">
        <div className="font-bold text-2xl">Import data</div>
        <div className="text-sm text-gray-700">
          Click the button below to upload your users from csv file. Each column
          of the first row in this file should be the keys.
        </div>
      </div>
      <CSVReader
        cssClass="react-csv-input"
        label=""
        onFileLoaded={handleForce}
        parserOptions={papaparseOptions}
      />

      <div className="py-8 space-y-2">
        <div className="font-bold text-2xl">View Users</div>
        <div className="text-sm text-gray-700">
          You can view and filter your users based on any criteria you set using
          filters below
        </div>

        {fileInfo !== {} && (
          <FilterComponent
            setFilters={setFilters}
            headers={tableColumns}
            typesOfColumns={typesOfColumns}
          />
        )}
      </div>

      <Table columns={columns} data={csvData} />
    </div>
  )
}

export default App
