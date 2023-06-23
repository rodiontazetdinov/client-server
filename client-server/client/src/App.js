
import './App.css';
import DownloadContainer from './components/DownloadContainer';
import FormWithSocketIO from './components/FormWithSocketIO';

function App() {
  return (
    <div className="App">
      <FormWithSocketIO/>
      <DownloadContainer/>
    </div>
  );
}

export default App;
