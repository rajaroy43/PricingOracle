## pip3 install pycoingecko
##  run this as python3 ./coingeck_api_test.py
## to try it out.

from pycoingecko import CoinGeckoAPI
import datetime
import numpy as np

def get_price(sym, endTime):
    # sym: a symbol taken from cg.get_coins_list() command
    # endTime: is the timestamp for the price we seek.

    cg = CoinGeckoAPI()
    ### Other cg things to try:
    # print(cg.ping())
    # print(cg.get_coins_list())
    # print(cg.get_coin_history_by_id('ethereum','10-02-2021'))

    ## datetime(year, month, day[, hour[, minute[, second[, microsecond[,tzinfo]]]]])

    # We need to grab a range of dates and prices, then interpolate to get the match of the exact date.
    from_time = endTime - datetime.timedelta(hours=1)   #datetime.datetime(2021, 10, 18, 13, 50, tzinfo = datetime.timezone.utc)
    to_time = endTime + datetime.timedelta(hours=1) # datetime.datetime(2021, 10, 19, 16, 10, tzinfo = datetime.timezone.utc)


    symbol_prices = cg.get_coin_market_chart_range_by_id(id=sym,vs_currency='usd',from_timestamp=from_time.timestamp(),to_timestamp=to_time.timestamp())
    prices =[]
    ptimes = []
    for i in symbol_prices['prices']:
        prices.append(i[0])
        ptimes.append(i[1])

    endPrice = np.interp(endTime.timestamp()*1000, prices, ptimes)


    return endPrice, endTime


if __name__ == "__main__":

    ## Testing via python:
    # Run:  python3 ./coingeck_api_test.py
    # to run the example below.

    ### Timestamp funzone
    ##Format Reference: datetime(year, month, day[, hour[, minute[, second[, microsecond[,tzinfo]]]]])
    current_time_yesterday = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)

    ## Here is the example function call.  
    # the 'ethereum' syntax is taken from the result list 
    # from cg.get_coins_list()
    sym = 'ethereum'
    p, pt = get_price(sym, current_time_yesterday)

    print("Requested Symbol: ", sym, "Requested Time: ", current_time_yesterday)
    print("Price of ", sym, " was:  ${:,.2f}".format(p), "on: ", pt)