'use client';

import React, { useMemo, useState } from 'react';

import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  Skeleton,
  Tooltip,
  MenuItem
} from '@mui/material';
import {COLORS, lightPalette} from '../colours';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Delete } from '@mui/icons-material';
import AppButton from '../AppButton';
import AppConfirmDialog from '../Appconfirmdialog';
export interface AppTableColumn<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';

  render?: (
    row: T,
    index: number
  ) => React.ReactNode;
}

interface AppTableProps<T> {
  title: string;
  description?: string;

  columns: AppTableColumn<T>[];
  rows: T[];

  getRowId: (
    row: T
  ) => string | number;

  loading?: boolean;

  searchPlaceholder?: string;
  filterLabel?: string;
  filterOptions?: string[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;

  onAdd?: () => void;
  addButtonText?: string;

  onEdit?: (
    row: T
  ) => void;

  onDelete?: (
    row: T
  ) => void;
}

export default function AppTable<T>({
  title,
  description,

  columns,
  rows,
  getRowId,

  loading = false,

  searchPlaceholder = 'Search...',
 filterLabel = 'Category',
  filterOptions = [],
  filterValue = '',
  onFilterChange,
  onAdd,
  addButtonText = 'Add',

  onEdit,
  onDelete,
}: AppTableProps<T>) {
  /* ================================
     SEARCH
  ================================= */

  const [
    searchValue,
    setSearchValue,
  ] = useState('');

  /* ================================
     SORT
  ================================= */

  const [
    sortBy,
    setSortBy,
  ] = useState<keyof T | null>(
    null
  );

  const [
    sortDirection,
    setSortDirection,
  ] = useState<'asc' | 'desc'>(
    'asc'
  );

  /* ================================
     PAGINATION
  ================================= */

  const [
    page,
    setPage,
  ] = useState(0);

  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState(10);

  /* ================================
     SEARCH + SORT
  ================================= */
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const processedRows = useMemo(() => {
    let result = [...rows];

    // Search
    if (searchValue.trim()) {
      const search = searchValue
        .toLowerCase()
        .trim();

      result = result.filter(
        (row) =>
          Object.values(
            row as Record<
              string,
              unknown
            >
          ).some((value) =>
            String(value)
              .toLowerCase()
              .includes(search)
          )
      );
    }
 // Filter
  if (filterValue) {
    result = result.filter((row) => {
      const category = (row as Record<string, unknown>)
        .category;

      return String(category) === filterValue;
    });
  }
    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        const valueA = String(
          a[sortBy] ?? ''
        ).toLowerCase();

        const valueB = String(
          b[sortBy] ?? ''
        ).toLowerCase();

        if (valueA < valueB) {
          return sortDirection ===
            'asc'
            ? -1
            : 1;
        }

        if (valueA > valueB) {
          return sortDirection ===
            'asc'
            ? 1
            : -1;
        }

        return 0;
      });
    }

    return result;
  }, [
    rows,
    searchValue,
    filterValue,
    sortBy,
    sortDirection,
  ]);

  /* ================================
     PAGINATION
  ================================= */

  const paginatedRows =
    processedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage +
        rowsPerPage
    );

  /* ================================
     SORT HANDLER
  ================================= */

  const handleSort = (
    column: keyof T
  ) => {
    if (sortBy === column) {
      setSortDirection(
        sortDirection === 'asc'
          ? 'desc'
          : 'asc'
      );
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }

    setPage(0);
  };

  /* ================================
     SEARCH HANDLER
  ================================= */

  const handleSearch = (
    value: string
  ) => {
    setSearchValue(value);
    setPage(0);
  };

  /* ================================
     RENDER
  ================================= */

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: 3,
        // border: '1px solid',
        // borderColor: 'divider',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        m: 'auto'
      }}
    >
      {/* ==================================
          TOP HEADER
      ================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
          pt: 3,
          pb: 2,
        }}
      >
   <Stack
  sx={{
    flexDirection: {
      xs: 'column',
      md: 'row',
    },
    justifyContent: 'space-between',
    alignItems: {
      xs: 'stretch',
      md: 'center',
    },
  }}
  spacing={2}
>
          {/* TITLE */}
          <Box>
            <Typography
              variant="h5"
             
              sx={{
                color: 'text.primary',
                mb: 0.5,
                 fontWeight:700
              }}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {description}
              </Typography>
            )}
          </Box>

          {/* ADD BUTTON */}
          {onAdd && (
            <AppButton
              variant="primary"
              startIcon={<AddIcon />}
              onClick={onAdd}
            >
              {addButtonText}
            </AppButton>
          )}
        </Stack>
      </Box>

      {/* ==================================
          SEARCH BAR
      ================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
          pb: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={searchValue}
          onChange={(event) =>
            handleSearch(
              event.target.value
            )
          }
          placeholder={
            searchPlaceholder
          }
          sx={{
            maxWidth: {
              xs: '100%',
              sm: 420,
            },

            '& .MuiOutlinedInput-root': {
              borderRadius: 2,

              backgroundColor:
                'background.default',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    color="action"
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        {filterOptions.length > 0 &&
      onFilterChange && (
        <TextField
          select
          size="small"
          label={filterLabel}
          value={filterValue}
          onChange={(event) => {
  onFilterChange(event.target.value);
  setPage(0);
}}
          sx={{
            width: {
              xs: '100%',
              sm: 220,
            },

            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor:
                'background.default',
            },
          }}
        >
          <MenuItem value="">
            All Categories
          </MenuItem>

          {filterOptions.map(
            (option) => (
              <MenuItem
                key={option}
                value={option}
              >
                {option}
              </MenuItem>
            )
          )}
        </TextField>
      )}
      </Box>

      {/* ==================================
          TABLE
      ================================== */}

      <TableContainer sx = {{borderRadius: 3, border: '1px solid',
         borderColor: 'divider',}}>
        <Table>
          {/* TABLE HEADER */}
          <TableHead 
          sx={{
    background: 'linear-gradient(135deg, #0072FF 0%, #00C6FF 100%)',
    '& th': {
      color: '#FFFFFF',
      fontWeight: 600,
    },
  }}
          >
            <TableRow
            
              sx={{
                backgroundColor:
                  'action.hover',
              }}
            >
              {columns.map(
                (column) => (
                  <TableCell
                    key={String(
                      column.id
                    )}
                    align={
                      column.align ??
                      'left'
                    }
                    sx={{
                      minWidth:
                        column.minWidth,
                      fontWeight: 700,
                      color:
                        'text.secondary',
                      fontSize: '0.8rem',
                      textTransform:
                        'uppercase',
                      letterSpacing:
                        '0.04em',
                      borderBottom:
                        '1px solid',
                      borderColor:
                        'divider',
                      py: 1.8,
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={
                          sortBy ===
                          column.id
                        }
                        direction={
                          sortBy ===
                          column.id
                            ? sortDirection
                            : 'asc'
                        }
                        onClick={() =>
                          handleSort(
                            column.id
                          )
                        }
                      >
                        {
                          column.label
                        }
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                )
              )}

              {/* ACTION COLUMN */}
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  color:
                    'text.secondary',
                  fontSize: '0.8rem',
                  textTransform:
                    'uppercase',
                  letterSpacing:
                    '0.04em',
                  borderBottom:
                    '1px solid',
                  borderColor:
                    'divider',
                  py: 1.8,
                  width: 130,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          {/* TABLE BODY */}
          <TableBody>
            {/* LOADING */}
            {loading &&
              Array.from({
                length: 5,
              }).map((_, index) => (
                <TableRow
                  key={`loading-${index}`}
                >
                  {columns.map(
                    (column) => (
                      <TableCell
                        key={String(
                          column.id
                        )}
                      >
                        <Skeleton
                          variant="text"
                          width="80%"
                        />
                      </TableCell>
                    )
                  )}

                  <TableCell>
                    <Stack
                    sx= {{ direction:'row',
                      justifyContent:'center'}}
                      spacing={1}
                    >
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                      />

                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

            {/* EMPTY */}
            {!loading &&
              paginatedRows.length ===
                0 && (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      1
                    }
                    align="center"
                    sx={{
                      py: 7,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No data found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

            {/* DATA */}
            {!loading &&
              paginatedRows.map(
                (row, index) => (
                  <TableRow
                    key={String(
                      getRowId(row)
                    )}
                    hover
                    sx={{
                      '&:last-child td': {
                        borderBottom: 0,
                      },

                      '&:hover': {
                        backgroundColor:
                          'action.hover',
                      },
                    }}
                  >
                    {columns.map(
                      (column) => (
                        <TableCell
                          key={String(
                            column.id
                          )}
                          align={
                            column.align ??
                            'left'
                          }
                          sx={{
                            py: 1.8,
                          }}
                        >
                          {column.render
                            ? column.render(
                                row,
                                index
                              )
                            : String(
                                row[
                                  column.id
                                ] ?? ''
                              )}
                        </TableCell>
                      )
                    )}

                    {/* ACTIONS */}
                    <TableCell
                    
                      align="center"
                      sx={{
                        py: 1.8,
                      }}
                    >
                      <Stack
                      direction = "row"
                      sx= {{ 
                        justifyContent: 'center',
                    alignItems: 'center'}}
                        spacing={0.5}
                      >
                        {/* EDIT */}
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() =>
                                onEdit(
                                  row
                                )
                              }
                              sx={{
                                borderRadius: 1.5,

                                '&:hover':
                                  {
                                    backgroundColor:
                                      'action.selected',
                                  },
                              }}
                            >
                              <EditIcon
                                fontSize="small"
                              />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* DELETE */}
                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() =>{
                                 setSelectedRow(row);
  setDeleteDialogOpen(true);
                              }}
                              sx={{
                                borderRadius: 1.5,

                                '&:hover':
                                  {
                                    backgroundColor:
                                      'action.selected',
                                  },
                              }}
                            >
                              <DeleteIcon
                             sx={{color: 'red'}} 
                                fontSize="small"
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ==================================
          PAGINATION
      ================================== */}

      <TablePagination
        component="div"
        count={processedRows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[
          5,
          10,
          25,
          50,
        ]}
        onPageChange={(
          _event,
          newPage
        ) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(
          event
        ) => {
          setRowsPerPage(
            Number(
              event.target.value
            )
          );

          setPage(0);
        }}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',

          '& .MuiTablePagination-toolbar':
            {
              minHeight: 60,
              px: {
                xs: 1,
                sm: 2,
              },
            },
        }}
      />
      <AppConfirmDialog
  open={deleteDialogOpen}
  title="Delete Product"
    variant="delete"
  description="Are you sure you want to delete this product? This action cannot be undone."
  onClose={() => {
    setDeleteDialogOpen(false);
    setSelectedRow(null);
  }}
  onConfirm={() => {
    if (selectedRow && onDelete) {
      onDelete(selectedRow);
    }

    setDeleteDialogOpen(false);
    setSelectedRow(null);
  }}
/>
    </Paper>
    
  );
}

