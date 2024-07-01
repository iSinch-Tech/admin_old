import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Toolbar = ({ label, onNavigate }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" className="btn btn-control" onClick={() => onNavigate('PREV')}>
          <ArrowBackIcon />
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <button type="button" className="btn btn-control" onClick={() => onNavigate('NEXT')}>
          <ArrowForwardIcon />
        </button>
      </span>
    </div>
  )
}

export default Toolbar;
