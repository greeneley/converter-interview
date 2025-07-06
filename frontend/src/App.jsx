import './App.css'
import {useCallback, useMemo, useState} from "react";
import {useCustomHook, useHistory} from "./use-custom-hook.js";
import axios from "axios";


function History({ histories }) {
    if (!histories) return null;
    
    return (
        <table>
            <tbody>
            <tr>
                <th>STT</th>
                <th>Input Amount</th>
                <th>Input Currency</th>
                <th>Output Amount</th>
                <th>Output Currency</th>
                <th>Created At</th>
            </tr>
            {histories.map((history) => {
                return (
                    <tr key={history.id}>
                        <td>{history.id}</td>
                        <td>{history.input}</td>
                        <td>{history.input_currency}</td>
                        <td>{history.output}</td>
                        <td>{history.output_currency}</td>
                        <td>{history.create_at}</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

function App() {
    const [converterAmount, setConverterAmount] = useState();
    const [inputAmount, setInputAmount] = useState();
    const [toCurrency, setToCurrency] = useState();
    const [isShowHistory, setIsShowHistory] = useState(false);
    const {data} = useCustomHook();
    const {data: histories, setTrigger} = useHistory();
    const currencies = useMemo(() => {
        return data ? Object.keys(data.rates) : undefined
    }, [data])

    const handleSubmit = useCallback(async () => {
        const rate = data.rates[toCurrency];

        const converterAmount = inputAmount * rate;

        try {
            await axios.post("http://localhost:3000/converter", {
                "fromAmount": inputAmount, "toCurrency": toCurrency, "converterAmount": converterAmount
            });
            
            setTrigger(prev => prev + 1);
            
            setConverterAmount(converterAmount);
            
            setInputAmount('');
            setToCurrency('');
        } catch (error) {
            console.log(error);
        }
    }, [inputAmount, toCurrency, data, setTrigger]);

    const onClickShowHistory = useCallback(() => {
        setIsShowHistory(true);
        setTrigger(prev => prev + 1)
    }, [setTrigger])

    const onClickHideHistory = useCallback(() => {
        setIsShowHistory(false);
    }, [])
    return (<>
        <div>
            <h3>Type input amount:</h3>
            <input id="inputAmount" placeholder="type" value={inputAmount || ''}
                   onChange={(e) => setInputAmount(e.target.value)}/><span>$</span>
        </div>
        <div>
            <h3>Select output currency:</h3>
            <select id="toCurrency" value={toCurrency || ''} onChange={(e) => {
                setToCurrency(e.target.value);
            }}>
                <option value="">Select currency</option>
                {currencies && currencies.map((currency, index) => <option key={index}
                                                                           value={currency}>{currency}</option>)}
            </select>
        </div>
        <div>
            <button onClick={handleSubmit}>Submit</button>
        </div>

        {converterAmount && <div>
            <h3>Converter amount:</h3>
            <span>{converterAmount.toFixed(2)} {toCurrency}</span>
        </div>}
        <br/>
        <div>
            {!isShowHistory ? (
                <button onClick={onClickShowHistory}>Show history</button>
            ) : (
                <button onClick={onClickHideHistory}>Hide history</button>
            )}
        </div>
        {isShowHistory && <History histories={histories} />}
    </>)
}

export default App
