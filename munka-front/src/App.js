
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";

function App() {
  const [user, setUser] = useState({
    name: "",
    lastname: "",
    email: "",
    token: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [myCoupon, setMyCoupon] = useState("");
  const [textError, setTextError] = useState(false);
  const open = Boolean(anchorEl);

  const cartItems = [
    {
      price: 4500,
      pic: "https://m.media-amazon.com/images/I/81G8W7Ugl-L._AC_SX679_.jpg",
      description: "Sweetnight Queen Mattress",
    },
    {
      price: 10500,
      pic: "https://m.media-amazon.com/images/I/81+jvpJt6+L._AC_SL1500_.jpg",
      description: "Indoor Soft Small Low Pile Carpet",
    },
    {
      price: 500,
      pic: "https://m.media-amazon.com/images/I/619pHvEWo2L.__AC_SY445_SX342_QL70_FMwebp_.jpg",
      description: "Dimmable Floor Lamp",
    },
    {
      price: 5620,
      pic: "https://m.media-amazon.com/images/I/81BEgqWtJPL._AC_SY879_.jpg",
      description: "Whitmor 36 Pair Door Shoe Organizer",
    },
    {
      price: 1020,
      pic: "https://m.media-amazon.com/images/I/81Rsg3I80uL._AC_SX679_.jpg",
      description: "Dresser for Bedroom with 8 Drawers",
    },
  ];

  const login = async () => {
    try {
      const response = await fetch("http://localhost:3002/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // email: "john.doe@mail.com", //user 1
          // password: "Pass123",
          email: "chris.test@mail.com", // user 2
          password: "123Pass",
        }),
      });
      const parsedRta = await response.json();
      setUser(parsedRta);
    } catch (error) {}
  };

  const getUserCoupons = async () => {
    const response = await fetch("http://localhost:3002/coupons", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    });
    const parsedRta = await response.json();
    parsedRta.length && setCoupons(parsedRta);
  };

  useEffect(() => {
    login();
  }, []);

  useEffect(() => {
    if(user.token)
      getUserCoupons();
  }, [user]);

  const debounceCodeValidator = useCallback(
    debounce(async (couponCode) => {
      try {
        const response = await fetch(
          `http://localhost:3002/coupons/${couponCode}/validate`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (response.status !== 200) return setTextError(true);

        const parsedResponse = await response.json();
        setTextError(false);
        setAppliedCoupon(parsedResponse);
      } catch (error) {
        setTextError(true);
      }
    }, 1000),
    [user]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickMenuItem = (couponCode) => {
    setMyCoupon(couponCode);
    debounceCodeValidator(couponCode);
    handleClose();
  };

  const handleTextField = (couponCode) => {
    if(!couponCode){
      clearStates();
    } else {
      setMyCoupon(couponCode);
      debounceCodeValidator(couponCode);
    }
    
    
  };

  const cartTotal = () => {
    let total = 0;
    cartItems.forEach((e) => {
      total += e.price;
    });
    return total;
  };

  const handleBuy = async () => {
    let price = 0;
    cartItems.forEach((p) => (price += p.price));

    try {
      const response = await fetch("http://localhost:3002/buyOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          price: price,
          discountCode: appliedCoupon?.code ?? null,
        }),
      });
      const parsedResponse = await response.json();
      clearStates();
      getUserCoupons();
      alert(
        parsedResponse.coupon?.code 
        ? `Thanks you for your purchase. You can use this code in your next buy: ${parsedResponse.coupon.code}`
        : `Thanks you for your purchase`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const clearStates = () => {
    setAppliedCoupon(null);
    setMyCoupon("");
    setTextError(false);
  };

  return (
    <div className="App">
      <div className="header">
        {user.name} {user.lastname}
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          My Coupons
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {coupons.length &&
            coupons.map((e, i) => {
              return (
                <MenuItem key={i} onClick={() => handleClickMenuItem(e.code)}>
                  {e.code}
                </MenuItem>
              );
            })}
        </Menu>
      </div>

      <div className="cart">
        <div className="cart-detail">
          <div className="items-list">
            {cartItems.map((e, i) => {
              return (
                <div key={i} className="item-card">
                  <img
                    src={e.pic}
                    width={400}
                    height={130}
                    className="item-image"
                  ></img>
                  <div className="item-text">
                    <div>{e.description}</div>
                    <div style={{ textAlign: "end", marginRight: "1rem" }}>
                      ${e.price}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart-invoice">
            <div className="invoice-item">
              <div>Sub Total </div>
              <div>${cartTotal()}</div>
            </div>
            {appliedCoupon?.active && (
              <div className="invoice-item">
                <div>
                  Discount {`(`}
                  {appliedCoupon.discount}
                  {`%)`}{" "}
                </div>
                <div>- ${(cartTotal() * appliedCoupon.discount) / 100}</div>
              </div>
            )}
            <div className="invoice-item">
              <div>Total </div>
              {appliedCoupon?.active && (
                <div>
                  ${cartTotal() - (cartTotal() * appliedCoupon.discount) / 100}
                </div>
              )}
              {!appliedCoupon?.active && <div>${cartTotal()}</div>}
            </div>

            <div
              style={{
                display: "flex",
                justifySelf: "flex-end",
                width: "100%",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <TextField
                error={textError}
                label="I HAVE A COUPON"
                value={myCoupon}
                onChange={(e) => handleTextField(e.target.value)}
                helperText={textError ? "Invalid Coupon." : null}
              ></TextField>
              <Button onClick={handleBuy} variant="contained">
                BUY
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
