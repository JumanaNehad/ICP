import { exam2_backend } from '../../declarations/exam2_backend';

document.getElementById('insertExam').addEventListener('click', async () => {
  const examId = document.getElementById('examId').value;
  const outOf = document.getElementById('outOf').value;
  const course = document.getElementById('course').value;
  const curve = document.getElementById('curve').value;

  const exam = { out_of: Number(outOf), course, curve: Number(curve) };
  console.log('Inserting Exam:', exam);
  const result = await exam2_backend.insert_exam(BigInt(examId), exam);
  console.log('Insert Exam Result:', result);
  document.getElementById('examResult').innerText = JSON.stringify(result);
});

document.getElementById('fetchExam').addEventListener('click', async () => {
  const examId = document.getElementById('fetchExamId').value;
  console.log('Fetching Exam with ID:', examId);
  const result = await exam2_backend.get_exam(BigInt(examId));
  console.log('Fetch Exam Result:', result);
  document.getElementById('examResult').innerText = JSON.stringify(result);
});

document.getElementById('insertParticipation').addEventListener('click', async () => {
  const participationId = document.getElementById('participationId').value;
  const participation = document.getElementById('participation').value;

  console.log('Inserting Participation:', { id: participationId, value: participation });
  const result = await exam2_backend.insert_participation(BigInt(participationId), BigInt(participation));
  console.log('Insert Participation Result:', result);
  document.getElementById('participationResult').innerText = `Previous value: ${result ? result.toString() : 'None'}`;
});

document.getElementById('fetchParticipation').addEventListener('click', async () => {
  const participationId = document.getElementById('fetchParticipationId').value;
  console.log('Fetching Participation with ID:', participationId);
  const result = await exam2_backend.get_participation(BigInt(participationId));
  console.log('Fetch Participation Result:', result);
  document.getElementById('participationResult').innerText = `Fetched value: ${result ? result.toString() : 'None'}`;
});