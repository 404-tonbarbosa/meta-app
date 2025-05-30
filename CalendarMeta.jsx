import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DAILY_GOAL = 2000 / 30;
const MONTHLY_GOAL = 2000;
const API_URL = 'http://localhost:3001'; // ajuste para IP local no celular

function CalendarMeta() {
  const [dailyEarnings, setDailyEarnings] = useState({});
  const [totalEarnings, setTotalEarnings] = useState(0);

  const fetchGanhos = async () => {
    const res = await fetch(`${API_URL}/ganhos`);
    const data = await res.json();
    const ganhosMap = {};
    let total = 0;

    data.forEach((item) => {
      const dateKey = new Date(item.data).toDateString();
      ganhosMap[dateKey] = item.valor;
      total += item.valor;
    });

    setDailyEarnings(ganhosMap);
    setTotalEarnings(total);
  };

  useEffect(() => {
    fetchGanhos();
  }, []);

  const handleDayClick = async (date) => {
    const key = date.toDateString();
    const isoDate = date.toISOString().split('T')[0];
    const valor = prompt(`💸 Quanto você ganhou em ${key}?`, dailyEarnings[key] || '');
    if (valor !== null && !isNaN(valor)) {
      await fetch(`${API_URL}/ganhos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: isoDate, valor: parseFloat(valor) }),
      });
      fetchGanhos();
    }
  };

  const tileContent = ({ date }) => {
    const key = date.toDateString();
    const earned = dailyEarnings[key] || 0;
    const metGoal = earned >= DAILY_GOAL;
    return (
      <div style={{ fontSize: '0.7rem', textAlign: 'center' }}>
        {earned > 0 && (
          <span style={{ color: metGoal ? 'green' : 'red' }}>
            💵 R$ {earned.toFixed(2)}
          </span>
        )}
      </div>
    );
  };

  const tileClassName = ({ date }) => {
    const key = date.toDateString();
    const earned = dailyEarnings[key] || 0;
    if (earned >= DAILY_GOAL) {
      return 'goal-met';
    }
    return null;
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h3>📊 Progresso: R$ {totalEarnings.toFixed(2)} / R$ {MONTHLY_GOAL}</h3>
      <p>🔁 {(totalEarnings / MONTHLY_GOAL * 100).toFixed(1)}% da meta mensal</p>
      <Calendar
        tileContent={tileContent}
        tileClassName={tileClassName}
        onClickDay={handleDayClick}
      />
    </div>
  );
}

export default CalendarMeta;
