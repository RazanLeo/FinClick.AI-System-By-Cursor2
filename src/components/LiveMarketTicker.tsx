'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LiveMarketTickerProps {
  language: 'ar' | 'en';
}

interface MarketData {
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

const LiveMarketTicker: React.FC<LiveMarketTickerProps> = ({ language }) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate live market data
    const generateMarketData = () => {
      const markets = [
        { symbol: language === 'ar' ? 'تاسي' : 'TASI', baseValue: 12500 },
        { symbol: language === 'ar' ? 'الخليج' : 'Gulf', baseValue: 8500 },
        { symbol: language === 'ar' ? 'العربي' : 'Arab', baseValue: 9200 },
        { symbol: language === 'ar' ? 'آسيا' : 'Asia', baseValue: 7800 },
        { symbol: language === 'ar' ? 'أفريقيا' : 'Africa', baseValue: 6500 },
        { symbol: language === 'ar' ? 'أوروبا' : 'Europe', baseValue: 11200 },
        { symbol: language === 'ar' ? 'أمريكا' : 'America', baseValue: 15800 },
        { symbol: language === 'ar' ? 'أستراليا' : 'Australia', baseValue: 7200 },
        { symbol: language === 'ar' ? 'عالمي' : 'Global', baseValue: 13500 },
      ];

      const newData = markets.map(market => {
        const changePercent = (Math.random() - 0.5) * 4; // -2% to +2%
        const change = (market.baseValue * changePercent) / 100;
        const value = market.baseValue + change;
        
        return {
          symbol: market.symbol,
          value: Math.round(value),
          change: Math.round(change),
          changePercent: Math.round(changePercent * 100) / 100,
          isPositive: changePercent >= 0,
        };
      });

      setMarketData(newData);
    };

    // Generate initial data
    generateMarketData();
    setIsVisible(true);

    // Update data every 30 seconds
    const interval = setInterval(generateMarketData, 30000);

    return () => clearInterval(interval);
  }, [language]);

  const getChangeIcon = (isPositive: boolean, changePercent: number) => {
    if (Math.abs(changePercent) < 0.1) {
      return <Minus className="w-3 h-3 text-finclick-gold" />;
    }
    return isPositive ? 
      <TrendingUp className="w-3 h-3 text-finclick-success" /> : 
      <TrendingDown className="w-3 h-3 text-finclick-error" />;
  };

  const getChangeColor = (isPositive: boolean, changePercent: number) => {
    if (Math.abs(changePercent) < 0.1) {
      return 'text-finclick-gold';
    }
    return isPositive ? 'text-finclick-success' : 'text-finclick-error';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      transition={{ duration: 0.5 }}
      className="bg-finclick-gray border-b border-finclick-gold/20 py-2 overflow-hidden"
      style={{ marginTop: '80px' }} // Account for fixed header
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4 py-1 bg-finclick-gold text-black text-sm font-semibold font-playfair rounded-r-lg">
          {language === 'ar' ? 'مؤشرات السوق المباشرة' : 'Live Market Indicators'}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex items-center space-x-8"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {marketData.map((market, index) => (
              <motion.div
                key={market.symbol}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                <span className="text-finclick-gold font-semibold font-playfair text-sm">
                  {market.symbol}
                </span>
                <span className="text-finclick-gold font-playfair text-sm">
                  {market.value.toLocaleString()}
                </span>
                <div className="flex items-center gap-1">
                  {getChangeIcon(market.isPositive, market.changePercent)}
                  <span className={`font-playfair text-sm ${getChangeColor(market.isPositive, market.changePercent)}`}>
                    {market.change >= 0 ? '+' : ''}{market.change.toLocaleString()}
                  </span>
                  <span className={`font-playfair text-sm ${getChangeColor(market.isPositive, market.changePercent)}`}>
                    ({market.changePercent >= 0 ? '+' : ''}{market.changePercent}%)
                  </span>
                </div>
              </motion.div>
            ))}
            
            {/* Duplicate items for seamless loop */}
            {marketData.map((market, index) => (
              <motion.div
                key={`${market.symbol}-duplicate-${index}`}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                <span className="text-finclick-gold font-semibold font-playfair text-sm">
                  {market.symbol}
                </span>
                <span className="text-finclick-gold font-playfair text-sm">
                  {market.value.toLocaleString()}
                </span>
                <div className="flex items-center gap-1">
                  {getChangeIcon(market.isPositive, market.changePercent)}
                  <span className={`font-playfair text-sm ${getChangeColor(market.isPositive, market.changePercent)}`}>
                    {market.change >= 0 ? '+' : ''}{market.change.toLocaleString()}
                  </span>
                  <span className={`font-playfair text-sm ${getChangeColor(market.isPositive, market.changePercent)}`}>
                    ({market.changePercent >= 0 ? '+' : ''}{market.changePercent}%)
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveMarketTicker;
