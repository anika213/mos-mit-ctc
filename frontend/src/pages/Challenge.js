
import { Outlet } from 'react-router-dom';
import './Challenge.module.css';

function Challenge() {
  return (
    <div>
        <p>Challenge</p>
        <Outlet />
    </div>
  );
}

export default Challenge;
