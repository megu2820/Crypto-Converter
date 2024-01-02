import { useEffect, useState } from 'react';
import './App.css';
import { Typography, Card, CardContent, Grid, Select, TextField, MenuItem, Button, InputLabel, Divider } from '@mui/material';

const intialValues = {
  sourceCurr: 'BTC',
  amount: 0,
  targetCurr: 'USD',
}

function App() {
  const [values, setValues] = useState(intialValues);
  const [cryptos, setCryptos] = useState([]);
  const [targetCurrencies, setTargetCurrencies] = useState([]);
  const [output, setOutput] = useState();

  async function getCryptoCurrencies() {
    try {
      const res = await fetch('https://crypto-converter-5g4a.onrender.com/api');
      const data = await res.json();
      setCryptos(data);
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getSourceCurrencies() {
    try {
      const res = await fetch('https://crypto-converter-5g4a.onrender.com/target/api');
      const data = await res.json();
      setTargetCurrencies(data);
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCryptoCurrencies();
    getSourceCurrencies();
  }, [])

  const currencyOptions = cryptos.map((curr) => curr.symbol);
  const targetOptions = targetCurrencies.map((curr) => curr.symbol);

  const handleTextFieldChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  }

  const handleReset = (event) => {
    setValues({ ...intialValues })
    setOutput(undefined);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`https://crypto-converter-5g4a.onrender.com/convert/api?amount=${values.amount}&symbol=${values.sourceCurr}&convert=${values.targetCurr}`);
      const output = await res.json();
      // console.log(output[0], 'I m output')
      setOutput(output[0].quote[values.targetCurr].price)
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="App">
      <Grid style={{ padding: "80px 5px 0px 5px" }}>
        <Card style={{ maxWidth: 600, margin: "0 auto", maxHeight: 540 }}>
          <CardContent>
            <Typography variant='h4' color="primary">Convert It</Typography>
            <Typography variant='subtitle1' color="textSecondary" gutterBottom>Fill up the form to use the converter</Typography>
            <form action="/" onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Source Currency" select sx={{ width: 250 }}
                    value={values.sourceCurr}
                    name='sourceCurr'
                    onChange={handleTextFieldChange}
                    SelectProps={{
                      renderValue: (value) => value
                    }}
                  >
                    {currencyOptions.map((opt) => <MenuItem value={opt} key={opt}>{opt}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Target Currency" select sx={{ width: 250 }}
                    value={values.targetCurr}
                    name="targetCurr"
                    onChange={handleTextFieldChange}
                    SelectProps={{
                      renderValue: (value) => value
                    }}
                  >
                    {targetOptions.map((opt) => <MenuItem value={opt} key={opt}>{opt}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Amount" placeholder='Enter Amount' name='amount' variant="outlined" fullWidth required value={values.amount} sx={{ width: 250 }} onChange={handleTextFieldChange} />
                </Grid>
                <Grid xs={12} item sm={6}>
                  <Button variant="contained" onClick={handleReset} color="primary" fullWidth>Reset</Button>
                </Grid>
                <Grid xs={12} item sm={6}>
                  <Button variant="contained" type="submit" color="primary" fullWidth>Submit</Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
          {output ? (
            <Grid item xs={12} style={{ maxHeight: 400 }}>
              <Divider orientation="horizontal" flexItem />
              <b>{`Result: ${output}`}</b>
            </Grid>

          ) : []}
        </Card>
      </Grid>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
