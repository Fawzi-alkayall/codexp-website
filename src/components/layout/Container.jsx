import PropTypes from 'prop-types';

/**
 * Container component for consistent max-width and padding
 */
export function Container({ children, className = '', ...props }) {
  return (
    <div
      className={`container ${className}`}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
      {...props}
    >
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Container;
