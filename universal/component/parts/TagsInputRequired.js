import React from 'react';
import TagsInputComponent from 'react-tagsinput';
import $ from 'jquery';

const tagsRenderInput = (list, props) => {
  const isRequired = Array.isArray(list) ? !list.length : !list;

  return (
    <input type="text"
      required={isRequired}
      {...props}
    />
  )
};

const TagsInputRequired = (props) => (
  <TagsInputComponent
    {...props}
    addOnBlur={true}
    renderInput={tagsRenderInput.bind(this, props.value)}
  />
);

TagsInputRequired.PropTypes = {
  onChange: React.PropTypes.func.isRequired
};

export default TagsInputRequired;
