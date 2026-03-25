# `Table`
A structural organization system for rows and columns

## API

### `columns` `required`
| | |
|-----------|------------|
| Type | `TableColumnType<T>[]` |
| Default | `undefined` |
| Description | **Must be memoized for Table performance!**<br/>Array of objects that will be used for the Table header (`th`) cells, as well as column functionality.<br/>**Required** properties:<br/>- `name`: the content displayed in the `th` cell for a column<br/>- `accessor`: the key in the data object that maps to this property<br/>**Optional** properties:<br/>- `allowDataEdit`: `td` content in this column can be edited by the user<br/>- `columnStyles`: Object of CSS properties that will be applied to elements in the rendered column. Options include `column` (all `th` and `td` cells in the column), `header` (`th` cell of the column), and `data` (all `td` cells of the column).<br/>- `headerTextProps`: Object of Text props that will be applied to the Text node in column's `th` cell<br/>- `bodyTextProps`: Object of Text props that will be applied to the Text nodes in column's `td` cells<br/>Can also be extended with [column options from react-table](https://react-table-v7.tanstack.com/docs/api/useSortBy#column-options) |

### `data` `required`
| | |
|-----------|------------|
| Type | `TableDataType<T>` |
| Default | `undefined` |
| Description | **Must be memoized for Table performance!**<br/>Array of objects that will be displayed in the body rows (`tr`) of the Table. Properties will be displayed in the columns whose `accessor` property matches the data's property key.<br /> If manualPagination is set to true, the array should just contain the data for the selected page. |

### `rowsPerPage`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | Number determining the **maximum** number of rows to display on a given page. Set this property if you would like your Table to display a Pagination control. |

### `numPages`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | Use this alongside  `rowsPerPage` if you **know** how many pages your table **will** have/support, but the `data` array you're passing in isn't fully loaded. Recommend using this in combination with `onPageChange` for systematically fetching data from your API. Don't know how many pages you'll have? `rowsPerPage` can be used by itself, and `Table` will dynamically update the pagination controls as data is added/updated. |

### `defaultColumnSort`
| | |
|-----------|------------|
| Type | `{ accessor: string isDescending?: boolean }` |
| Default | `undefined` |
| Description | If set, Table body rows will automatically be sorted by this column on initial render. `accessor` property must match an accessor of a column object in `columns`. Set `isDescending` to `true` if you want the column to be sorted in descending order. Otherwise, the column will be sorted in ascending order. |

### `hiddenColumns`
| | |
|-----------|------------|
| Type | `string[]` |
| Default | `undefined` |
| Description | Columns whose `accessor` attribute is in this array will not be displayed in the Table. The entire column (both the `th` and `td` cells) will not be present in the rendered Table.<br/>If you only want to hide the column name, use `hiddenHeaders` prop. |

### `hiddenHeaders`
| | |
|-----------|------------|
| Type | `string[]` |
| Default | `undefined` |
| Description | Columns whose `accessor` attribute is in this array will be rendered as an empty `th` cell. Use when you want to display column data cell content, but not a column name (for example, if you're rendering checkboxes for row selections).<br/>If you want to hide the entire column, use `hiddenColumns` prop. |

### `allowDataEdit`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If set to `true`, users will be able to toggle cells between the displayed data and an editable `TextField` component. If you have a function you would like to call when the user finishes editing the cell, set that function in `onCellEdit`.<br/>Be aware that cells will **NOT** be editable if their value is a DOM node<br/>If you only want **certain** cells to be editable, set `allowDataEdit` to true in the `columns` object for that particular column. |

### `showDataLoading`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If set to `true`, a skeleton-style loading component will be displayed in the `Table` body. Use if you are fetching data for a table/page. |

### `isSortable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Set to `false` if you don't want the columns in your Table to be sortable. If `true`, sort icons will appear next to each `th` cell name, and user will be able to sort column in ascending and descending orders.<br/>Want to disable sorting on specific columns? Give that column object in `columns` the property<br/>`disableSortBy: true`<br/>(See [react-table documentation](https://react-table-v7.tanstack.com/docs/api/useSortBy#column-options) for more details) |

### `isMultiSort`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If set to `true`, user will be able to sort by multiple columns. |

### `onRowClick`
| | |
|-----------|------------|
| Type | `object (TableIdType<T> keys, any>, row?: TableRowType<T>, rows?: TableRowType<T>[]) = values)` |
| Default | `undefined` |
| Description | Function that will be called when Table body row (`tr`) is clicked. Will also pass back the `row` values as first arg, the `row` object as the second arg and all the `rows` as the third arg so the user can make use of any of the row data. <br /> If there is a use case to alter the internal state from this action like selecting a row, you can do so by making use of the apis provided by [react-table](https://react-table-v7.tanstack.com/docs/api/useRowSelect#instance-properties) |

### `onCellEdit`
| | |
|-----------|------------|
| Type | `(rowInfo: TableOnCellEditParams<T>) => void` |
| Default | `undefined` |
| Description | Function that will be called when user submits the edited Table cell (`td`).<br/>Callback will receive an object containing details about the row in the following structure:<br/>`shape({`<br/>`originalRow: [key: string]: string \| number - object passed to Table in "data"`<br/>`originalVal: string \| number - original value of the cell`<br/>`updatedVal: string - new value user entered in TextField`<br/>`rowIndex: number - index of row (originalVal) in "data" prop`<br/>`columnId: string - accessor of column that the cell belongs to`<br/>`})` |

### `onPageChange`
| | |
|-----------|------------|
| Type | `(pageInfo: TableOnPageChangeParams) => void` |
| Default | `undefined` |
| Description | Function that will be called when user changes page using the `Pagination` controls. Function will receive an object with two properties: `currentPage` and `requestedPage`. Note that pages start from **index 1** instead of index 0. |

### `onSort`
| | |
|-----------|------------|
| Type | `(columnInfo: TableOnSortParams[]) => void` |
| Default | `undefined` |
| Description | Function that will be called on `Table` sort updates. Function will receive an array populated with object(s) that the table is sorted by:<br/>`shape({`<br/>`id: string - accessor of the column passed into columns,`<br/>`desc: boolean - if the column is sorted in descending order,`<br/>`})`<br/>If function receives an empty array, it means that the table is unsorted. |

### `tableStyles`
| | |
|-----------|------------|
| Type | `{ headerRow?: TableCSSType headerCells?: TableCSSType body?: TableCSSType dataCells?: TableCSSType nestedDataCells?: TableCSSType row?: TableCSSType rowHovered?: TableCSSType rowPressed?: TableCSSType rowSelected?: TableCSSType rowDragged?: TableCSSType rowDraggedIndicator?: TableCSSType nestedRow?: TableCSSType nestedRowHovered?: TableCSSType nestedRowPressed?: TableCSSType nestedRowSelected?: TableCSSType tableWrapper?: TableCSSType tableContainer?: TableCSSType paginationWrapper?: TableCSSType menuContainer?: TableCSSType }` |
| Default | `undefined` |
| Description | Object of CSS properties that will be applied to elements of `Table`.<br/>See "Usage Tips" for details on how each sub-object will be applied |

### `headerInlineChildrenProps`
| | |
|-----------|------------|
| Type | `TableInlineChildrenProps` |
| Default | `undefined` |
| Description | Object of InlineChildren props that will be applied to the InlineChildren wrapper around the `th` cell `Text` and sorting icon nodes |

### `headerTextProps`
| | |
|-----------|------------|
| Type | `TableTextProps` |
| Default | `undefined` |
| Description | Object of Text props that will be applied to the Text nodes in `th` cells |

### `bodyTextProps`
| | |
|-----------|------------|
| Type | `TableTextProps` |
| Default | `undefined` |
| Description | Object of Text props that will be applied to the Text nodes in `td` cells |

### `manualPagination`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Turn on manual pagination. Both `manualPagination` and `currentPage` should be used to enable server side page rendering. |

### `autoResetSortBy`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | When `true`, the sortBy state will automatically reset if any of the following conditions are met: data is changed |

### `currentPage`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | If set, overrides current selected page. Both `manualPagination` and `currentPage` should be used to enable server side page rendering. Note that pages start from **index 1** instead of index 0. |

### `renderBeforePaginationContent`
| | |
|-----------|------------|
| Type | `string \| (fromRow: number, toRow: number, totalRows: number \| undefined => string \| React.ReactNode)` |
| Default | `undefined` |
| Description | Function that takes in content rows (fromRow, toRow), total rows count and returns a string or React node to be rendered before pagination. (for example, if your table has 20 rows and `rowsPerPage={5}`, the function will receive params as `fromRow=1, toRow=5, totalRows=20` then you can return `Showing 1-5 of 20 Fruits` which will be displayed before pagination). Set this property if you would like to render custom content inline with the pagination controls of your Table. |

### `renderPagination`
| | |
|-----------|------------|
| Type | `(props: TableRenderPaginationProps) => ReactNode` |
| Default | `undefined` |
| Description | Function that enables rendering custom pagination controls. The method will be passed a props object that contains `currentPage`, `numPages`, and `changePage`. |

### `paginationProps`
| | |
|-----------|------------|
| Type | `TablePaginationProps` |
| Default | `undefined` |
| Description | Props to pass through to underlying `NumberedPagination` component from `@doordash/component-numbered-pagination`. |

### `showRowSelectionColumn`
| | |
|-----------|------------|
| Type | `boolean \| ((row: TableRowType) => boolean)` |
| Default | `false` |
| Description | If set to `true`, a row selection column will be displayed in the `Table`. |

### `selectedRows`
| | |
|-----------|------------|
| Type | `object (string keys, boolean values)` |
| Default | `undefined` |
| Description | The Row IDs of the rows matching the value provided for the Record will be checked in the `Table` (ex: `{ 0: true, 2: true }`), and will update the table state if modified. Use in combination with `onRowSelect`, to control row selection manually within the `Table`. **Note:** If you wish to control row selection outside `Table`, use `selectedRows` otherwise you should use `defaultRowSelection`. |

### `shouldDisableRowSelection`
| | |
|-----------|------------|
| Type | `(row: TableRowType<T>) => boolean` |
| Default | `undefined` |
| Description | If a function is given, returns whether to enable/disable row selection for a particular row. |

### `defaultRowSelection`
| | |
|-----------|------------|
| Type | `{ [key: string]: string \| number \| boolean \| Array<string \| number> // need to accept strings for subrow ids like "4.0", otherwise the "0" gets lost }` |
| Default | `undefined` |
| Description | The rows matching the value provided for accessor in object of type `{(accessor: string): (value: string \| number \| boolean)}` will be checked by default on initial load of `Table`. <br /> You can also provide row IDs in the form of array using `id` key, rows with provided Ids will be checked. <br /> (for example, if your provide `{id: [0, 2, 3, 8]}` then rows with id `0, 2, 3, 8` will be checked and if you provide `{ isStonefruit: 'Yes', isFuzzy: 'Yes' }`  then rows with `isStonefruit: 'Yes'` OR `isFuzzy: 'Yes'` will be checked by default when table loads). <br /> The combination (i.e.`{id: [0, 3], isFuzzy: 'Yes'}`) can also be provided. **Note:** You should choose to either default the initial row selection with `defaultRowSelection` and let the `Table` control selection, otherwise use `selectedRows`. |

### `onRowSelect`
| | |
|-----------|------------|
| Type | `(selectedRowValues: T[], selectedRows: TableRowType<T>[], toggledRows: T[] \| undefined, isToggledOn: boolean \| undefined, rowSelection: Record<number, boolean>) => void` |
| Default | `undefined` |
| Description | Function that will be called when table row is toggled. <br/>`shape({`<br/>`selectedRowValues: any[] - list rows with original data supplied to the table,`<br/>`selectedRows: any[] - list of rows with original data & some additional properties added by react-table like id, index, cells,`<br/>`toggledRows: any[] - list of rows those were toggled in last toggle change (single item in case of row toggle and rows on current page if header checkbox is toggled),`<br/>`isToggledOn: boolean - can be used with toggledRows to know if rows were checked or unchecked}),`<br/>`rowSelection: Record<string, boolean> - row selection state stored by the table` |

### `menuItems`
| | |
|-----------|------------|
| Type | `TableMenuItemProps<T>[]` |
| Default | `undefined` |
| Description | Array of objects that can be used to perform actions on rows, menu items will be displayed for each row as list items in Popover. `hideItem` function receives a row  for which menu is open and list of all selected rows as parameters, menu item will be hidden when `hideItem` function returns true. |

### `onMenuItemClick`
| | |
|-----------|------------|
| Type | `(action: string, originalRow: T, selectedFlatRows: T[]) => void` |
| Default | `undefined` |
| Description | Function that can be used with `menuItems` and will be called when menu item is clicked. Will also pass back the `id` of clicked menu item, corresponding `row` and `selectedRows` which user can make use of. |

### `leadingStickyColumn`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Pass the ID of a column that you want to stick to the leading edge of the table. |

### `trailingStickyColumn`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Pass the ID of a column that you want to stick to the trailing edge of the table. |

### `hasStickyHeader`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | When set to true the table header will have `position: sticky` and a slightly different visual treatment to indicate that it is "stuck". As a note, you will need to set a `max-height` on the `TableWrapper` via the `tableStyles` prop. |

### `autoResetExpanded`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | When `true`, the expanded state will automatically reset if any of the following conditions are met: data is changed |

### `defaultRowExpanded`
| | |
|-----------|------------|
| Type | `object (key-value pairs)` |
| Default | `undefined` |
| Description | If a row's id is set to true in this object, that row will have an expanded state. For example, if `{ '3': true }` was passed as the expanded state, by default **the 4th row in the original data array** would be expanded, since it would have that ID. If you need to manage the expanded state in a controlled manner, add `expanded: true` to the row data object in the `data` prop. |

### `paginateExpandedRows`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If set to `true`, expanded rows are paginated along with normal rows. This results in stable page sizes across every page. If set to `false`, expanded rows will be spliced in after pagination. This means that the total number of rows in a page can potentially be larger than the page size, depending on how many subrows are expanded. |

### `isDraggable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If set to `true`, a drag handle will be added to top level (non-nested) rows, allowing you to reorder your data. |

### `onDragStart`
| | |
|-----------|------------|
| Type | `(event: TableRowDragEndEvent) => void` |
| Default | `undefined` |
| Description | Fires when a drag event occurs on a row. Returns the event for when a row has been picked up. |

### `onDragEnd`
| | |
|-----------|------------|
| Type | `(dragEventData: TableRowOnDragEndParams<T>) => void` |
| Default | `undefined` |
| Description | Fires after a draggable item is dropped. Returns the event as well as the newly ordered table data. |

### `accessibilityAccessor`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Provide this to allow more descriptive experience by letting Table know the most descriptive cell data. |

## Usage

### Table - default state

**Be sure to define an interface to type the arrays passed to the `data` and `column` props.** This should maintain type-safety when working with values passed to your callbacks.
```typescript
import { Table, TableColumnType } from '@doordash/prism-react'

interface MyTableData { ... }
const memoizedData: MyTableData[] = ...
const memoizedColumns: TableColumnType<MyTableData>[] = ...

...

<Table columns={memoizedColumns} data={memoizedData} />
```
### Table - setting custom styles with `tableStyles`
```typescript
import { Table, TableColumnType } from '@doordash/prism-react'

interface MyTableData { ... }
const memoizedData: MyTableData[] = ...
const memoizedColumns: TableColumnType<MyTableData>[] = ...
...

  <Table
    columns={memoizedColumns}
    data={memoizedData}
    tableStyles={{
      rowHovered: {
        'background-color': theme.Colors.BackgroundSecondary,
      },
      rowPressed: {
        'background-color': theme.Colors.BackgroundTertiary,
      },
    }}
  />
```
### Table - setting custom styles for a single column with `columnStyles`
```typescript
import { Table, TableColumnType } from '@doordash/prism-react'

interface MyTableData { ... }
...

// Columns object used in `memoizedColumns`

const columns: TableColumnType<MyTableData> = [
  { name: 'First Name', accessor: 'firstName' },
  {
    name: 'Last Name',
    accessor: 'lastName',
    columnStyles: {
      header: {
        'background-color': theme.Colors.BannerDefaultBackground,
      },
      data: {
        'background-color': theme.Colors.BackgroundSecondary,
      }
    }
  }
]

...

  // `lastName` column will have custom background colors applied, while rest of
  // table will render with default Table styles

  <Table columns={memoizedColumns} data={memoizedData} />
```
### Table - setting body Text styles with `bodyTextProps`
```typescript
import { Table, TextSize } from '@doordash/prism-react'

interface MyTableData { ... }
const memoizedData: MyTableData[] = ...
const memoizedColumns: TableColumnType<MyTableData>[] = ...
...

  <Table
    columns={memoizedColumns}
    data={memoizedData}
    bodyTextProps={{
      size: TextSize.medium,
    }}
  />
```
### Table - fetching additional data with `onPageChange`
```typescript
import { Table, TableColumnType } from '@doordash/prism-react'

interface MyTableData { ... }
const memoizedData: MyTableData[] = ...
const memoizedColumns: TableColumnType<MyTableData>[] = ...
...

  <Table
    columns={memoizedColumns}
    data={memoizedData} // only has data for first 3 pages on initial render
    rowsPerPage={10}
    numPages={5}
    onPageChange={pageInfo => {
      if (pageInfo.currentPage < pageInfo.requestedPage) {
        // API call to fetch remaining data and append to `memoizedData`
      }
    }}
  />
```
### Table - setup for server side page rendering
```typescript
import { Table, TableColumnType } from '@doordash/prism-react'

interface MyTableData { ... }
const memoizedData: MyTableData[] = ...
const memoizedColumns: TableColumnType<MyTableData>[] = ...
...

  <Table
    manualPagination={true} // tells the table we are going to manually handle pagination
    columns={memoizedColumns}
    data={getDataForPage(currentPage)} // only has data for the current page
    rowsPerPage={10}
    numPages={10}
    onPageChange={pageInfo => currentPage = pageInfo.requestedPage} // change currentPage to be the new page
    currentPage={currentPage} // explicitly specify the current page the table is on
  />
```
### Table - custom pagination content
```typescript
import { Table, TableColumnType } from '@doordash/prism-react'

interface MyTableData { ... }
const memoizedData: MyTableData[] = ...
const memoizedColumns: TableColumnType<MyTableData>[] = ...
...

<Table
  columns={memoizedColumns}
  data={memoizedData}
  renderPagination={({ numPages, currentPage, changePage }) => {
    return (
      <InlineChildren alignItems={InlineChildrenAlignment.Center}>
        <Button
          isDisabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
          isInline
        >
          Back
        </Button>
        <Text>
          Page {currentPage} of {numPages}
        </Text>
        <Button
          isDisabled={currentPage === numPages}
          onClick={() => changePage(currentPage + 1)}
          isInline
        >
          Next
        </Button>
      </InlineChildren>
    )
  }}
/>
```
### Usage tips

* **MEMOIZE YOUR `columns` and `data` arrays!** This is recommended by `react-table` to ensure efficiency of the table when rendering and re-rendering. See [docs](https://react-table-v7.tanstack.com/docs/api/overview#option-memoization) for more information.
* Passing positive and negative **number data** in a column? Use the option `sortType: 'basic'` to ensure proper sorting of your numbers (react-table defaults to alphanumeric sorting)
  * Example:
    ```
      columns={[
        { name: 'Summary', accessor: 'summary' },
        { name: '% Change', accessor: 'percentChg', sortType: 'basic' },
        ...
      ]}
    ```
* You can access row information in your `onRowClick` handler!
  * Example: `<Table ... onRowClick={(row) => console.log(row)}/>`
* **Want to render DOM nodes in your data?** You can either directly set the value as a DOM node in your `data` array objects, OR you can set the `Cell` property in that column's object with a function that accesses the cell value and wraps your desired DOM node around it. See [react-table's documentation](https://react-table-v7.tanstack.com/docs/api/useTable#column-options) for more information.
* Body cells will **NOT** be editable if they are DOM nodes. If you want to utilize the `allowCellEdit` and `onCellEdit` API props, use string or number values for those cells.
* Only want **some** of your cells to be editable? Set `allowCellEdit: true` on the **`columns`** objects where you want cells to be editable. Only those will be editable to your user!
* If your `onCellEdit` callback is making any updates to the data you're passing to `Table`, remember that the `updatedVal` property in the callback is in **string** form - if you rely on that data being in a specific form (e.g. Number), make that change in your callback before passing along the updated data
* `tableStyles` objects are applied as follows:
  * `tableWrapper`: applied to the full-width wrapper `div` surrounding the `div` container for the `table` element in `Table`
  * `tableContainer`: applied to the container `div` immediately surrounding the `table` element in `Table`
  * `paginationWrapper`: applied to the `div` surrounding the `renderBeforePaginationContent`, `renderPagination`, and `Pagination` content below the `table` wrapper
  * `headerRow`: applied to `thead` `tr` element
  * `headerCells`: applied to all `th`s
  * `body`: applied to the `tbody` element
  * `dataCells`: applied to all `td` cells in `tbody`
  * `row`: applied to all `tr`s in `tbody`
  * `rowHovered`: applied to `:hover` CSS for all `tr`s in `tbody`
  * `rowPressed`: applied to `:active` CSS for all `tr`s in `tbody`
  * `rowSelected`: applied to selected CSS for all `tr`s in `tbody`
  * `nestedDataCells`: applied to all `td` cells nested in an expandable `tr`
  * `nestedRow`: applied to all `tr`s nested in an expandable `tr`
  * `nestedRowHovered`: applied to `:hover` CSS for all `tr`s nested in an expandable `tr`
  * `nestedRowPressed`: applied to `:active` CSS for all `tr`s nested in an expandable `tr`
  * `nestedRowSelected`: applied to selected CSS for all `tr`s nested in an expandable `tr`
* If you would like your table to have a set height (regardless of the number of rows) to keep the Pagination controls in place while navigating through pages, use the `tableStyles` `tableWrapper` property!