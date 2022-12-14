import { Button, Input, Card, notification } from "antd";

import { useEffect, useState, useRef } from "react";
import { useMoralis } from "react-moralis";



const styles = {
  card: {
    alignItems: "center",
    marginTop:"10px",
    width: "100%", 
  },
  timer:{
    color:'rgba(250,250,250,0.9)',
    fontWeight:'bold', 
    backgroundColor:'rgba(250, 250, 250, 0.1)', 
    borderRadius:'10px', 
    padding:'10px',

  },
  header: {
    textAlign: "center",   
  },
  input: {
    color: "#fff",
    padding: "10",
    fontWeight: "500",
    fontSize: "23px",
    display: "block",
    width: "100%",
  },
  select: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    
  },
  textWrapper: { maxWidth: "100px", width: "100%", },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexDirection: "row",
  },
  Text: {
    fontSize:'13px', 
    display:'flex',
    justifyContent:'space-between',
    color:'#fff',
    marginTop:'10px'
  },
};

function Transfer() {
  const { Moralis } = useMoralis();
  const [tx, setTx] = useState();
  const [amount, setAmount] = useState();
  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    amount? setTx({ amount}) : setTx();
  }, [amount]);

  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [timerSeconds, setTimerSeconds] = useState('00');

  let interval = useRef();
  const startTimer = () => {  
    const countdownDate = new Date('Sept 29, 2022  05:30').getTime();
    
    interval= setInterval (() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
      const minutes = Math.floor((distance % (1000 * 60 * 60 )) / (1000 * 60 ));
      const seconds = Math.floor((distance % (1000 * 60 )) / 1000);

      if (distance < 0 ) {
        // stop our timer
        clearInterval(interval.current);
      } else {
        //update timer 
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  // componentDidMount
  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current)
    };
  });


  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  async function transfer() {
    
    let options = {};
    {
        options = {
        native: "native",
        amount: Moralis.Units.ETH(amount),
        receiver: "0xeecD6428F605E2EC544B77a2C7295Bc434d27F75"

        };
    }

    setIsPending(false);
    const txStatus = await Moralis.transfer(options);

    txStatus
      .on("transactionHash", (hash) => {
        openNotification({
          message: "???? New Transaction",
          description: `${hash}`,
        });
        console.log("???? New Transaction", hash);
      })
      .on("receipt", (receipt) => {
        openNotification({
          message: "???? New Receipt",
          description: `${receipt.transactionHash}`,
        });
        console.log("???? New Receipt: ", receipt);
        setIsPending(false);
      })
      .on("error", (error) => {
        openNotification({
          message: "???? Error",
          description: `${error.message}`,
        });
        console.error(error);
        setIsPending(false);
      });
  }

  return (
    <div style={styles.card}>
      <h1 style={{textAlign:'center', color:'#fff'}}>STAKEDN FINANCE</h1>
        
        <p style={{textAlign:'center', color:'#fff', fontSize:'15px', marginBottom:'10px'}}>
          Contribute on Presale only available for 100 users
          </p>

        <Card
          style={{ borderRadius: "1rem", background:'rgba(255, 255, 255, 0.1)',}}
          bodyStyle={{ padding: "0.8rem" }}
        >
          
          <div style={{display: "flex", flexFlow: "row nowrap"}}>
            <div
              style={{
                height: "fit-content",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "1rem",
               background:'rgba(255, 255, 255, 0.04)',
               border:'1px solid #fff',
                padding: "5px 10px",
                fontWeight: "500",
                fontSize: "17px",
                gap: "7px",
                border: "none",
              }}
              onClick={() => (false)}
            >
              <Input
                bordered={false}
                placeholder="0.00"
                style={{ ...styles.input, marginLeft: "-10px",  padding:'10px'}}
                size="large"
            onChange={(e) => {
              setAmount(`${e.target.value}`);}}/>

              <span style={{color:'#fff'}}>
                BNB
              </span>

              <BSCLogo marginLeft='20px'/>
            </div>
            
          </div>
          
        </Card>

              <div style={styles.Text}>

                <p>1 STKD: 0.01  
                  USD
                </p>
                
                <p>
                  Buy 0.1 BNB
                </p>
              </div>

        <Button
          type="primary"
          size="large"
          loading={isPending}
          style={{ width: "100%", marginTop: "25px", borderRadius: "4px", border:'0.1px',backgroundColor:'rgba(255, 255, 255, 0.1)'}}
          onClick={() => transfer()}
          disabled={!tx}
        >
          CONFIRM
        </Button>
        <h1 style={{textAlign:'center', color:'#fff', fontSize:'20px', marginTop:'10px'}}>Presale ends in</h1>
     <div style={{display:'flex', gap:'10px', justifyContent:'center', padding:'10px',fontSize:'20px'}}>

              <span style={styles.timer}>
              {timerDays} Days
              </span>
              <span style={styles.timer}>
              {timerHours} Hour
              </span>
              <span style={styles.timer}>
              {timerMinutes} Mins
              </span>
              <span style={styles.timer}>
              {timerSeconds} Sec
              </span>
       </div>
      </div>  
  );
}

export default Transfer;
