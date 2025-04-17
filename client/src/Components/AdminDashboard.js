import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Pagination,
  IconButton,
  TextField,
  TableSortLabel,
} from '@mui/material';
import { Block, CheckCircle, ArrowBack, ArrowForward } from '@mui/icons-material';

const BLOCK_USER = gql`
  mutation BlockUser($id: ID!) {
    blockUser(id: $id) {
      id
      fullName
      email
      userType
      blocked
    }
  }
`;

const GET_USERS = gql`
  query GetUsers($page: Int, $limit: Int) {
    users(page: $page, limit: $limit) {
      users {
        id
        fullName
        email
        userType
        blocked
      }
      totalPages
      currentPage
    }
  }
`;

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const limit = 10;

  const { data, loading, error } = useQuery(GET_USERS, {
    variables: { page: currentPage, limit },
    errorPolicy: 'all',
  });

  const [blockUser] = useMutation(BLOCK_USER, {
    update(cache, { data: { blockUser } }) {
      const existingData = cache.readQuery({
        query: GET_USERS,
        variables: { page: currentPage, limit },
      });

      const updatedUsers = existingData?.users?.users.map((user) =>
        user.id === blockUser.id ? { ...user, blocked: blockUser.blocked } : user
      );

      cache.writeQuery({
        query: GET_USERS,
        variables: { page: currentPage, limit },
        data: {
          users: {
            ...existingData?.users,
            users: updatedUsers,
          },
        },
      });
    },
  });

  const [loadingBlock, setLoadingBlock] = useState(false);

  const handleBlockUnblock = (userId) => {
    setLoadingBlock(true);
    blockUser({ variables: { id: userId } })
      .then(() => setLoadingBlock(false))
      .catch(() => setLoadingBlock(false));
  };

  const handleNext = () => {
    if (data && currentPage < data.users.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let users = data?.users?.users || [];

    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      users = users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower) ||
          (u.userType || '').toLowerCase().includes(lower)
      );
    }

    if (sortBy) {
      users = [...users].sort((a, b) => {
        const valA = a[sortBy]?.toLowerCase?.() || '';
        const valB = b[sortBy]?.toLowerCase?.() || '';
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return users;
  }, [data, searchText, sortBy, sortOrder]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading users: {error.message}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '40px' }}>
      <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0277bd' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', marginTop: 1 }}>
          Manage users, job listings, and more from here.
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          label="Search Users"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                ID
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={sortBy === 'fullName'}
                  direction={sortBy === 'fullName' ? sortOrder : 'asc'}
                  onClick={() => handleSort('fullName')}
                >
                  Full Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Email
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={sortBy === 'userType'}
                  direction={sortBy === 'userType' ? sortOrder : 'asc'}
                  onClick={() => handleSort('userType')}
                >
                  User Type
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell align="center">{user.id}</TableCell>
                <TableCell align="center">{user.fullName}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.userType || 'Unknown'}</TableCell>
                <TableCell align="center">
                  {user.blocked ? (
                    <Typography color="error">Blocked</Typography>
                  ) : (
                    <Typography color="primary">Active</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {loadingBlock ? (
                    <CircularProgress size={24} />
                  ) : user.blocked ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<CheckCircle />}
                      onClick={() => handleBlockUnblock(user.id)}
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<Block />}
                      onClick={() => handleBlockUnblock(user.id)}
                    >
                      Block
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <IconButton onClick={handlePrevious} disabled={currentPage === 1}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ alignSelf: 'center' }}>
          Page {currentPage} of {data?.users?.totalPages || 1}
        </Typography>
        <IconButton onClick={handleNext} disabled={currentPage === data?.users?.totalPages}>
          <ArrowForward />
        </IconButton>
      </Box>

      <Box sx={{ textAlign: 'center', marginTop: 3 }}>
        <Pagination
          count={data?.users?.totalPages || 1}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    </Container>
  );
}
