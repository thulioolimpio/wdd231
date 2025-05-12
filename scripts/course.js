// Array de cursos atualizado
const courses = [
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 3, completed: true },
    { code: "ITM 111", name: "Introduction to Databases", credits: 2, completed: false },
    { code: "WDD 130", name: "Web Fundamentals", credits: 3, completed: true },
    { code: "CSE 111", name: "Programming with Functions", credits: 3, completed: true },
    { code: "WDD 231", name: "Web Frontend Development 1", credits: 3, completed: false },
    { code: "CSE 210", name: "Programming with Classes", credits: 3, completed: true },
    // ... outros cursos que já estavam no array
  ];
  
  // Função para exibir cursos
  function displayCourses(filter = "all") {
    const filteredCourses = filter === "all" ? courses : 
        courses.filter(course => course.code.includes(filter.toUpperCase()));
    
    const courseContainer = document.getElementById("course-cards");
    courseContainer.innerHTML = "";
  
    filteredCourses.forEach(course => {
      const card = document.createElement("div");
      card.className = `course-card ${course.completed ? "completed" : ""}`;
      card.innerHTML = `
        <h3>${course.code}</h3>
        <p>${course.name}</p>
        <p>Credits: ${course.credits}</p>
        <p>Status: ${course.completed ? "✅ Completed" : "⌛ In Progress"}</p>
      `;
      courseContainer.appendChild(card);
    });
  
    // Atualizar total de créditos
    updateTotalCredits(filteredCourses);
  }
  
  // Função para atualizar o total de créditos
  function updateTotalCredits(filteredCourses) {
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById("total-credits").textContent = totalCredits;
  }
  
  // Event listeners para os botões de filtro
  document.getElementById("all").addEventListener("click", () => displayCourses("all"));
  document.getElementById("wdd").addEventListener("click", () => displayCourses("wdd"));
  document.getElementById("cse").addEventListener("click", () => displayCourses("cse"));
  
  // Carregar cursos ao iniciar
  document.addEventListener("DOMContentLoaded", () => {
    displayCourses();
  });