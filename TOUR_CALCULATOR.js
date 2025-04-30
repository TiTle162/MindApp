function splitExpenseWithLessOnLastDay(total, days, nights, type) {
  if (days <= nights) {
    console.error("Days should be greater than nights.");
    return;
  }

  const equalDays = days - 1; // วันอื่นๆ ที่ต้องแบ่งค่าใช้จ่าย
  let x = Math.floor(total / days); // ค่าใช้จ่ายเฉลี่ย
  let y = total - x * equalDays; // ค่าใช้จ่ายที่เหลือในวันสุดท้าย

  // คำนวณเปอร์เซ็นต์สำหรับวันที่สุดท้าย โดยใช้ night*2 สำหรับค่าอาหาร หรือ day*3 สำหรับกิจกรรม
  let lastDayPercent;
  let usedValue;
  if (type === "food") {
    lastDayPercent = ((nights * 2) % 100) / 100; // สำหรับค่าอาหาร: night * 2
    usedValue = nights * 2;
  } else if (type === "activity") {
    lastDayPercent = ((days * 3) % 100) / 100; // สำหรับกิจกรรม: day * 3
    usedValue = days * 3;
  }

  const maxLastDayValue = total * lastDayPercent;

  // ถ้า y มากกว่าค่า maxLastDayValue ให้ปรับ x ใหม่
  if (y > maxLastDayValue) {
    y = maxLastDayValue;
    x = Math.floor((total - y) / equalDays); // ปรับค่า x ใหม่หลังจากปรับ y
  }

  const result = Array(equalDays).fill(x); // วันอื่นๆ ให้ใช้ค่า x
  result.push(y); // วันสุดท้ายใช้ค่า y
  return { result, usedValue }; // คืนค่า result และ usedValue
}

function calculateBudget(budget, days, nights, people = 1) {
  if (days <= nights) {
    console.error("Days should be greater than nights.");
    return;
  }

  const flight = budget * 0.4; // 40% สำหรับเครื่องบิน
  const hotel = budget * 0.2; // 20% สำหรับโรงแรม
  const foodTotal = budget * 0.25; // 25% สำหรับค่าอาหาร
  const activityTotal = budget * 0.15; // 15% สำหรับกิจกรรม

  // คำนวณการแบ่งค่าอาหารและกิจกรรม
  const foodSplitResult = splitExpenseWithLessOnLastDay(
    foodTotal,
    days,
    nights,
    "food"
  );
  const activitySplitResult = splitExpenseWithLessOnLastDay(
    activityTotal,
    days,
    nights,
    "activity"
  );

  // แสดงผล
  console.log(`💰 **งบรวม**: ${budget.toLocaleString()} บาท`);
  console.log(`🗓 **จำนวนวัน**: ${days} วัน, 🌙 **จำนวนคืน**: ${nights} คืน\n`);

  console.log(`🛫 **เครื่องบิน (40%)**: ${flight.toFixed(2)} บาท`);

  // ค่าโรงแรม
  console.log(
    `🏨 **โรงแรม (20%)**: ${hotel.toFixed(2)} บาท${
      people > 1 ? ` (*${people} คน = ${(hotel * people).toFixed(2)} บาท)` : ""
    }`
  );
  const hotelPerNight = hotel / nights;
  for (let i = 1; i <= nights; i++) {
    const percent = ((hotelPerNight / hotel) * 100).toFixed(2);
    console.log(
      `    • Night ${i}: ${hotelPerNight.toFixed(2)} บาท (${percent}%)${
        people > 1
          ? ` (*${people} คน = ${(hotelPerNight * people).toFixed(2)} บาท)`
          : ""
      }`
    );
  }

  // ค่าอาหาร
  console.log(`\n🍜 **ค่าอาหาร (25%)**: ${foodTotal.toFixed(2)} บาท`);
  foodSplitResult.result.forEach((amount, i) => {
    const percent = ((amount / foodTotal) * 100).toFixed(2);
    console.log(`    • Day ${i + 1}: ${amount.toFixed(2)} บาท (${percent}%)`);
  });
  console.log(
    `    คำนวณจาก: ${nights} คืน * 2 = ${foodSplitResult.usedValue.toFixed(2)}%`
  );

  // ค่าเดินทาง/กิจกรรม
  console.log(
    `\n🚌 **ค่าเดินทาง/กิจกรรม (15%)**: ${activityTotal.toFixed(2)} บาท`
  );
  activitySplitResult.result.forEach((amount, i) => {
    const percent = ((amount / activityTotal) * 100).toFixed(2);
    console.log(`    • Day ${i + 1}: ${amount.toFixed(2)} บาท (${percent}%)`);
  });
  console.log(
    `    คำนวณจาก: ${days} วัน * 3 = ${activitySplitResult.usedValue.toFixed(
      2
    )}%`
  );
}

// ตัวอย่างเรียกใช้
calculateBudget(2500, 5, 4, 2);
