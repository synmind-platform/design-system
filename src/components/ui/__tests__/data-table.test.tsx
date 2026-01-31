import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DataTable, type Column } from '../data-table'

interface TestData {
  id: number
  name: string
  email: string
  status: string
}

const testData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'active' },
]

const testColumns: Column<TestData>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
]

describe('DataTable', () => {
  it('renders data rows', () => {
    render(<DataTable data={testData} columns={testColumns} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<DataTable data={testData} columns={testColumns} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<DataTable data={testData} columns={testColumns} data-testid="table" />)
    expect(screen.getByTestId('table')).toHaveAttribute('data-slot', 'data-table')
  })

  it('shows empty message when no data', () => {
    render(<DataTable data={[]} columns={testColumns} />)
    expect(screen.getByText('Nenhum dado encontrado')).toBeInTheDocument()
  })

  it('shows custom empty message', () => {
    render(<DataTable data={[]} columns={testColumns} emptyMessage="No results" />)
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<DataTable data={testData} columns={testColumns} title="Users" />)
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders header actions when provided', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
        title="Users"
        headerActions={<button>Add User</button>}
      />
    )
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument()
  })

  it('shows loading skeleton when loading', () => {
    render(<DataTable data={testData} columns={testColumns} loading />)

    // Should not show actual data when loading
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()

    // Should show skeleton rows
    const skeletonRows = document.querySelectorAll('.animate-pulse')
    expect(skeletonRows.length).toBeGreaterThan(0)
  })

  it('shows record count in footer', () => {
    render(<DataTable data={testData} columns={testColumns} />)
    expect(screen.getByText('3 registros')).toBeInTheDocument()
  })

  it('shows singular record count for single item', () => {
    render(<DataTable data={[testData[0]]} columns={testColumns} />)
    expect(screen.getByText('1 registro')).toBeInTheDocument()
  })

  describe('Search functionality', () => {
    it('shows search input when searchable is true', () => {
      render(<DataTable data={testData} columns={testColumns} searchable />)
      expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
    })

    it('uses custom search placeholder', () => {
      render(
        <DataTable
          data={testData}
          columns={testColumns}
          searchable
          searchPlaceholder="Search users..."
        />
      )
      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
    })

    it('filters data when searching', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          data={testData}
          columns={testColumns}
          searchable
          searchFields={['name']}
        />
      )

      const searchInput = screen.getByPlaceholderText('Buscar...')
      await user.type(searchInput, 'John')

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument()
    })

    it('shows filtered count when searching', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          data={testData}
          columns={testColumns}
          searchable
          searchFields={['name']}
        />
      )

      const searchInput = screen.getByPlaceholderText('Buscar...')
      await user.type(searchInput, 'John')

      expect(screen.getByText(/1 registro/)).toBeInTheDocument()
      expect(screen.getByText(/filtrado de 3/)).toBeInTheDocument()
    })

    it('calls onSearch callback', async () => {
      const user = userEvent.setup()
      const onSearch = vi.fn()
      render(
        <DataTable
          data={testData}
          columns={testColumns}
          searchable
          onSearch={onSearch}
        />
      )

      const searchInput = screen.getByPlaceholderText('Buscar...')
      await user.type(searchInput, 'test')

      expect(onSearch).toHaveBeenCalled()
    })
  })

  describe('Sorting functionality', () => {
    it('renders sort indicator for sortable columns', () => {
      const sortableColumns: Column<TestData>[] = [
        { key: 'name', header: 'Name', sortable: true },
        { key: 'email', header: 'Email', sortable: false },
      ]

      render(<DataTable data={testData} columns={sortableColumns} />)

      const nameHeader = screen.getByText('Name').closest('th')
      expect(nameHeader).toHaveClass('cursor-pointer')
    })

    it('calls onSort when sortable column is clicked', async () => {
      const user = userEvent.setup()
      const onSort = vi.fn()
      const sortableColumns: Column<TestData>[] = [
        { key: 'name', header: 'Name', sortable: true },
      ]

      render(
        <DataTable
          data={testData}
          columns={sortableColumns}
          onSort={onSort}
        />
      )

      await user.click(screen.getByText('Name'))
      expect(onSort).toHaveBeenCalledWith('name', 'asc')
    })

    it('toggles sort direction when clicked again', async () => {
      const user = userEvent.setup()
      const onSort = vi.fn()
      const sortableColumns: Column<TestData>[] = [
        { key: 'name', header: 'Name', sortable: true },
      ]

      render(
        <DataTable
          data={testData}
          columns={sortableColumns}
          onSort={onSort}
          sortColumn="name"
          sortDirection="asc"
        />
      )

      await user.click(screen.getByText('Name'))
      expect(onSort).toHaveBeenCalledWith('name', 'desc')
    })
  })

  describe('Row click functionality', () => {
    it('calls onRowClick when row is clicked', async () => {
      const user = userEvent.setup()
      const onRowClick = vi.fn()

      render(
        <DataTable
          data={testData}
          columns={testColumns}
          onRowClick={onRowClick}
        />
      )

      await user.click(screen.getByText('John Doe'))
      expect(onRowClick).toHaveBeenCalledWith(testData[0], 0)
    })

    it('highlights selected rows', () => {
      render(
        <DataTable
          data={testData}
          columns={testColumns}
          selectedRows={[0]}
          onRowClick={() => {}}
        />
      )

      const rows = document.querySelectorAll('tbody tr')
      expect(rows[0]).toHaveClass('bg-synmind-blue-500/5')
    })
  })

  describe('Custom rendering', () => {
    it('uses custom render function for column', () => {
      const columnsWithRender: Column<TestData>[] = [
        { key: 'name', header: 'Name' },
        {
          key: 'status',
          header: 'Status',
          render: (value) => <span data-testid="custom-status">{value.toUpperCase()}</span>,
        },
      ]

      render(<DataTable data={testData} columns={columnsWithRender} />)

      const customStatuses = screen.getAllByTestId('custom-status')
      expect(customStatuses[0]).toHaveTextContent('ACTIVE')
    })

    it('passes row and index to render function', () => {
      const renderFn = vi.fn((_value, row, index) => (
        <span>{`${index}: ${row.name}`}</span>
      ))

      const columnsWithRender: Column<TestData>[] = [
        { key: 'id', header: 'ID', render: renderFn },
      ]

      render(<DataTable data={testData} columns={columnsWithRender} />)

      expect(renderFn).toHaveBeenCalledWith(1, testData[0], 0)
      expect(renderFn).toHaveBeenCalledWith(2, testData[1], 1)
    })
  })

  describe('Column alignment', () => {
    it('applies center alignment', () => {
      const columnsWithAlign: Column<TestData>[] = [
        { key: 'name', header: 'Name', align: 'center' },
      ]

      render(<DataTable data={testData} columns={columnsWithAlign} />)

      const header = screen.getByText('Name').closest('th')
      expect(header).toHaveClass('text-center')
    })

    it('applies right alignment', () => {
      const columnsWithAlign: Column<TestData>[] = [
        { key: 'name', header: 'Name', align: 'right' },
      ]

      render(<DataTable data={testData} columns={columnsWithAlign} />)

      const header = screen.getByText('Name').closest('th')
      expect(header).toHaveClass('text-right')
    })
  })

  it('merges custom className', () => {
    render(
      <DataTable
        data={testData}
        columns={testColumns}
        className="custom-class"
        data-testid="table"
      />
    )
    expect(screen.getByTestId('table')).toHaveClass('custom-class')
  })
})
