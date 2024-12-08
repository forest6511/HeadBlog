import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
} from '@nextui-org/react'
import { TaxonomyWithPostRefsResponse } from '@/types/api/taxonomy/response'
import { TaxonomyActions } from './TaxonomyActions'
import { TAXONOMY_COLUMNS } from './constants'
import React from 'react'

interface TaxonomyTableProps {
  taxonomies: TaxonomyWithPostRefsResponse[]
  onDelete: () => void
  isLoading?: boolean
}

export const TaxonomyTable: React.FC<TaxonomyTableProps> = ({
  taxonomies,
  onDelete,
  isLoading = false,
}) => {
  const renderCell = (
    taxonomy: TaxonomyWithPostRefsResponse,
    columnKey: React.Key
  ) => {
    const cellValue = taxonomy[columnKey as keyof TaxonomyWithPostRefsResponse]

    switch (columnKey) {
      case 'name':
        return <Link href={`/taxonomy/${taxonomy.slug}`}>{cellValue}</Link>
      case 'count':
        return (
          <Link href={`/taxonomy/${taxonomy.slug}/items`}>
            {taxonomy.postIds.length}
          </Link>
        )
      case 'actions':
        return <TaxonomyActions taxonomyId={taxonomy.id} onDelete={onDelete} />
      default:
        return cellValue
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-52">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Table aria-label="タクソノミー一覧">
      <TableHeader>
        {TAXONOMY_COLUMNS.map((column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'end' : 'start'}
          >
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={taxonomies}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
