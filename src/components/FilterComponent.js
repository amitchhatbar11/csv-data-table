import { useState } from 'react'

const FilterComponent = ({ setFilters }) => {
  const [list, setList] = useState([])

  const addFilter = () => {
    const key = {
      key: Date.now(),
      column: 'name',
      condition: 'contains',
      type: 'text',
      value: '',
      options: [
        { type: 'text', label: 'Name', value: 'name' },
        { type: 'text', label: 'Email', value: 'email' },
        { type: 'number', label: 'Spend', value: 'price' },
        { type: 'number', label: 'Total Spend', value: 'total_spend' }
      ],
      conditionOptions: [
        { type: 'text', label: 'contains', value: 'contains' },
        { type: 'text', label: 'does not Contains', value: 'notContains' },
        {
          type: 'number',
          label: 'is equal To',
          value: 'equalTo'
        },
        { type: 'number', label: 'is not equal To', value: 'notEqualTo' },
        { type: 'number', label: 'is greater Than', value: 'greaterThan' },
        { type: 'number', label: 'is less Than', value: 'lessThan' }
      ]
    }
    setList([...list, key])
  }

  const removeFilter = (key) => {
    setList((prevState) => {
      return prevState.filter((item) => item.key !== key)
    })
  }

  const columnValueChange = (e, key) => {
    setList((prevState) => {
      return prevState.map((item) => {
        if (item.key === key) {
          const itemColumn = e.target.value
          item.column = itemColumn
          item.type = item.options.find(
            (option) => option.value === itemColumn
          ).type
          if (item.type === 'text') {
            item.condition = 'contains'
          } else {
            item.condition = 'equalTo'
          }
        }
        return item
      })
    })
  }

  const conditionValueChange = (e, key) => {
    setList((prevState) => {
      return prevState.map((item) => {
        if (item.key === key) {
          item.condition = e.target.value
        }
        return item
      })
    })
  }

  const onValueChange = (e, key) => {
    setList((prevState) => {
      return prevState.map((item) => {
        if (item.key === key) {
          item.value = e.target.value
        }
        return item
      })
    })
  }

  const applyFilters = () => {
    const filterList = list.map((item) => {
      return {
        column: item.column,
        condition: item.condition,
        type: item.type,
        value: item.value
      }
    })
    setFilters(filterList)
  }

  return (
    <>
      {list.map((item) => (
        <div className="flex space-x-3" key={item.key}>
          <select
            className="form-select appearance-none block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            aria-label="Default select example"
            value={item.column}
            onChange={(e) => columnValueChange(e, item.key)}
          >
            <option disabled>Column</option>
            {item.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="form-select appearance-none block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            aria-label="Default select example"
            value={item.condition}
            onChange={(e) => conditionValueChange(e, item.key)}
          >
            <option disabled>Conditions</option>
            {item.type === 'text'
              ? item.conditionOptions
                  .filter((filterItem) => filterItem.type === 'text')
                  .map((condOption) => (
                    <option key={condOption.value} value={condOption.value}>
                      {condOption.label}
                    </option>
                  ))
              : item.type === 'number'
              ? item.conditionOptions
                  .filter((filterItem) => filterItem.type === 'number')
                  .map((condOption) => (
                    <option key={condOption.value} value={condOption.value}>
                      {condOption.label}
                    </option>
                  ))
              : null}
          </select>
          <input
            type="text"
            placeholder="value"
            className="form-select appearance-none block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            onChange={(e) => onValueChange(e, item.key)}
          />
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => removeFilter(item.key)}
          >
            Delete
          </button>
        </div>
      ))}
      <div className="space-x-3">
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={addFilter}
        >
          Add Filter
        </button>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={applyFilters}
        >
          Filter Results
        </button>
      </div>
    </>
  )
}

export default FilterComponent
