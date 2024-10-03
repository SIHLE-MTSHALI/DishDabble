import React from 'react';
import { Chip, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TagList = ({ tags }) => {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/search?tag=${tag}`);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Popular Tags
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {tags.map((tag) => (
          <Chip
            key={tag._id}
            label={`${tag.name} (${tag.count})`}
            onClick={() => handleTagClick(tag.name)}
            clickable
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagList;