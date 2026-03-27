const getRainPrediction = async () => {
  const city = "vadodara";

  const res = await fetch(
    `http://127.0.0.1:5000/api/rain/predict?location=${vadodara}`
  );

  const data = await res.json();

  console.log(data);
};