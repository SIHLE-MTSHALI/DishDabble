import React, { useEffect } from 'react';
import { Chip, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TagList = ({ tags }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('TagList: Received tags', tags);
    if (tags && tags.length > 0) {
      tags.forEach((tag, index) => {
        console.log(`Tag ${index}:`, {
          id: tag._id,
          name: tag.name,
          count: tag.count
        });
      });
    } else {
      console.log('TagList: No tags to display');
    }
  }, [tags]);

  const handleTagClick = (tag) => {
    console.log('TagList: Tag clicked', tag);
    navigate(`/search?tag=${tag}`);
  };

  if (!tags || tags.length === 0) {
    return <Typography>No tags found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Explore Tags
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {tags.map((tag) => {
          console.log('TagList: Rendering tag', {
            id: tag._id,
            name: tag.name,
            count: tag.count
          });
          return (
            <Chip
              key={tag._id}
              label={`${tag.name} (${tag.count})`}
              onClick={() => handleTagClick(tag.name)}
              clickable
              color="primary"
              variant="outlined"
              sx={{
                fontSize: '1.4rem',
                height: 'auto',
                padding: '12px',
                borderRadius: '20px',
                '& .MuiChip-label': {
                  padding: '10px 16px',
                },
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default TagList;