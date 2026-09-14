export type Language = "es" | "en";

export const translations = {
  // ============================================================
  // ESPAÑOL
  // ============================================================

  es: {
   

    common: {
      all: "Todas",
      save: "Guardar cambios",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      create: "Crear",
      close: "Cerrar",
      custom: "Personalizada",
      confirm: "Confirmar",
      yes: "Sí",
      no: "No",
      loading: "Cargando...",
    },



    navigation: {
      tasks: "Tareas",
      profile: "Mi perfil",
      dashboard: "Dashboard",
      calendar: "Calendario",
      settings: "Configuración",
      logout: "Cerrar sesión",
    },

  

    userMenu: {
      profile: "Mi perfil",
      profileDescription: "Ver mi información",

      editProfile: "Editar perfil",
      editProfileDescription: "Modificar mis datos",

      logout: "Cerrar sesión",
      logoutDescription: "Salir de mi cuenta",
    },

  

    header: {
      dashboard: "Dashboard",
      tasks: "Tareas",
      calendar: "Calendario",
      profile: "Perfil",
      settings: "Configuración",
      logout: "Cerrar sesión",

      language: "Idioma",
      spanish: "Español",
      english: "Inglés",
    },

 
    dashboard: {
      taskflow: "TaskFlow",
      dashboard: "Dashboard",

      title: "Mi dashboard",

      description:
        "Organiza tus tareas, controla tu progreso y mejora tu productividad.",

      todaySummary: "Resumen de hoy",

      welcome: "¡Bienvenido de nuevo! 👋",

      welcomeDescription:
        "Gestiona tus tareas, revisa tu progreso y mantén todo organizado desde un solo lugar.",

      totalTasks: "Total de tareas",

      statistics: {
        total: "TOTAL",
        completed: "COMPLETADAS",
        pending: "PENDIENTES",
        productivity: "PRODUCTIVIDAD",

        createdTasks: "Tareas creadas",
        finishedTasks: "Tareas finalizadas",
        pendingTasks: "Tareas por completar",
      },

      activity: "Actividad",

      activityDescription:
        "Resumen de tus tareas actuales.",

      summary: "Resumen",

      summaryDescription:
        "Estado actual de tus tareas.",

      completed: "Completadas",
      pending: "Pendientes",
      inProgress: "En progreso",

      highPriority: "Alta prioridad",

      myTasks: "Mis tareas",

      myTasksDescription:
        "Busca, filtra y organiza tus tareas.",

      calendar: "Calendario",

      noTasks: "No hay tareas",

      noTasksDescription:
        "Crea tu primera tarea y empieza a organizar tu día con TaskFlow.",

      search: "Buscar tareas...",
      newTask: "Nueva tarea",

      firstStep: "Tu primer paso",

      firstTaskTitle: "¡Empieza a organizar tu día!",

      firstTaskDescription:
        "Aún no tienes tareas. Crea la primera, añade una fecha o prioridad y convierte FlowDesk en tu espacio de trabajo.",

      firstTaskHint:
        "Pulsa el botón “Nueva tarea” situado abajo a la derecha.",

      firstTaskFeature: "Añade tareas",

      firstPriorityFeature: "Define prioridades",

      firstCompleteFeature: "Completa objetivos",
    },


    filters: {
      status: "Estado de tareas",

      all: "Todas",
      pending: "Pendientes",
      inProgress: "En progreso",
      completed: "Completadas",

      priority: "Prioridad",
      allPriorities: "Todas",

      low: "Baja",
      medium: "Media",
      high: "Alta",

      sort: "Ordenar por",

      createdAt: "Fecha de creación",
      creationDate: "Fecha de creación",

      title: "Título",

      dueDate: "Fecha límite",

      prioritySort: "Prioridad",

      newest: "Más recientes",
      oldest: "Más antiguas",
    },


   tasks: {
  title: "Tareas",

  newTask: "Nueva tarea",

  createTask: "Crear tarea",

  editTask: "Editar tarea",

  deleteTask: "Eliminar tarea",

  saveTask: "Guardar tarea",

  cancel: "Cancelar",

  deleteTitle: "Eliminar tarea",

  deleteDescription:
    "¿Seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer.",

  deleting: "Eliminando...",

  move: "Mover",

  moveTask: "Mover tarea",

  viewTask: "Ver tarea",

  taskDetails: "Detalles de la tarea",

  noTasks: "No hay tareas",

  noTasksDescription:
    "No tienes tareas en esta sección.",

  searchPlaceholder: "Buscar tareas...",

  titleLabel: "Título",

  titlePlaceholder:
    "Escribe el título de la tarea...",

  descriptionLabel: "Descripción",

  descriptionPlaceholder:
    "Describe la tarea...",

  priorityLabel: "Prioridad",

  statusLabel: "Estado",

  dueDateLabel: "Fecha límite",

  tagLabel: "Etiqueta",

  tagPlaceholder: "Ej. Personal",

  createdAt: "Creada el",

  updatedAt: "Actualizada el",

  overdue: "Vencida",

  complete: "Completar tarea",

  markPending: "Marcar como pendiente",

  edit: "Editar tarea",

  delete: "Eliminar tarea",

  confirmDelete:
    "¿Estás seguro de que quieres eliminar esta tarea?",

  deleteWarning:
    "Esta acción no se puede deshacer.",

  emptyBoard:
    "No hay tareas en este estado.",

  dragAndDrop:
    "Arrastra las tareas para moverlas.",

  dragHere:
    "Arrastra una tarea aquí",

  taskSingular: "tarea",

  taskPlural: "tareas",

  details: {
      title: "Detalles de la tarea",
      description: "Descripción",
      noDescription: "Esta tarea no tiene una descripción.",
      priority: "Prioridad",
      status: "Estado",
      dueDate: "Fecha límite",
      close: "Cerrar",
      editTask: "Editar tarea",
      deleteTask: "Eliminar tarea",
      pending: "Pendiente",
      inProgress: "En progreso",
      completed: "Completada",
      completeTask: "Completar tarea",
      markPending: "Marcar como pendiente",
    },
},
  
    status: {
      pending: "Pendiente",

      inProgress: "En progreso",

      completed: "Completada",

      pendingPlural: "Pendientes",

      inProgressPlural: "En progreso",

      completedPlural: "Completadas",
    },

   

    priority: {
      low: "Baja",
      medium: "Media",
      high: "Alta",

      lowDescription: "Prioridad baja",

      mediumDescription: "Prioridad media",

      highDescription: "Prioridad alta",
    },

   
    calendar: {
      title: "Calendario",

      subtitle: "Fechas límite de tus tareas",

      tasksWithDate: "Tareas con fecha",

      today: "Hoy",

      previous: "Anterior",

      next: "Siguiente",

      month: "Mes",

      week: "Semana",

      day: "Día",

      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",

      january: "Enero",
      february: "Febrero",
      march: "Marzo",
      april: "Abril",
      may: "Mayo",
      june: "Junio",
      july: "Julio",
      august: "Agosto",
      september: "Septiembre",
      october: "Octubre",
      november: "Noviembre",
      december: "Diciembre",

      noTasks:
        "No hay tareas para este día.",
    },

   
    board: {
      title: "Tablero",

      pending: "Pendientes",

      inProgress: "En progreso",

      completed: "Completadas",

      moveHere: "Mover aquí",

      empty: "No hay tareas aquí.",

      dragTask:
        "Arrastra una tarea para moverla.",

      tasks: "tareas",

      task: "tarea",

      drag: "Arrastrar tarea",

      moved: "Tarea movida correctamente",

      movedError:
        "No se pudo mover la tarea",

      completedMessage:
        "Tarea completada ✅",

      inProgressMessage:
        "Tarea en progreso 🔵",

      pendingMessage:
        "Tarea pendiente 🟡",

      orderUpdated: "Orden actualizado",

      undo: "Deshacer",

      undoSuccess: "Movimiento deshecho",

      undoError: "No se pudo deshacer el movimiento",
},

    createTask: {
      title: "Nueva tarea",

      titleLabel: "Título",

      titlePlaceholder:
        "Escribe el título de la tarea...",

      descriptionLabel: "Descripción",

      descriptionPlaceholder:
        "Describe la tarea...",

      priorityLabel: "Prioridad",

      tagLabel: "Etiqueta",

      customTagLabel:
        "Nombre de la etiqueta",

      customTagPlaceholder:
        "Ej: Gimnasio, Viaje, Proyecto...",

      customTagHelp:
        "Puedes escribir cualquier etiqueta que quieras.",

      dueDateLabel: "Fecha límite",

      createButton: "Crear tarea",

      success:
        "Tarea creada correctamente",

      error:
        "No se pudo crear la tarea",
    },

 
    editTask: {
      title: "Editar tarea",

      titleLabel: "Título",

      titlePlaceholder: "Título...",

      descriptionLabel: "Descripción",

      descriptionPlaceholder:
        "Descripción...",

      priorityLabel: "Prioridad",

      tagLabel: "Etiqueta",

      customTagLabel:
        "Nombre de la etiqueta",

      customTagPlaceholder:
        "Nombre de tu etiqueta...",

      dueDateLabel: "Fecha límite",

      saveButton: "Guardar cambios",

      success:
        "Cambios guardados correctamente",

      error:
        "No se pudieron guardar los cambios",
    },

   

    tags: {
      work: "Trabajo",

      studies: "Estudios",

      personal: "Personal",

      home: "Casa",

      custom: "Personalizada",
    },



    form: {
      required:
        "Este campo es obligatorio.",

      invalidTitle:
        "Introduce un título válido.",

      invalidDate:
        "Introduce una fecha válida.",

      save: "Guardar",

      create: "Crear",

      update: "Actualizar",

      cancel: "Cancelar",

      close: "Cerrar",

      confirm: "Confirmar",

      loading: "Guardando...",

      creating: "Creando...",

      updating: "Actualizando...",
    },

   

    messages: {
      taskCreated:
        "Tarea creada correctamente.",

      taskUpdated:
        "Tarea actualizada correctamente.",

      taskDeleted:
        "Tarea eliminada correctamente.",

      taskMoved:
        "Tarea movida correctamente.",

      error:
        "Ha ocurrido un error.",

      genericError:
        "Algo salió mal. Inténtalo de nuevo.",

      completed:
        "Tarea completada ✅",

      inProgress:
        "Tarea en progreso 🔵",

      pending:
        "Tarea pendiente 🟡",

      movedError:
        "No se pudo mover la tarea",

      deleteConfirm:
        "¿Seguro que quieres eliminar esta tarea?",

      deleteSuccess:
        "Tarea eliminada correctamente",

      deleteError:
        "No se pudo eliminar la tarea",

      toggleCompleted:
        "Tarea completada",

      togglePending:
        "Tarea marcada como pendiente",

      updateError:
        "No se pudo actualizar la tarea",

      saveSuccess:
        "Cambios guardados correctamente",

      saveError:
        "No se pudieron guardar los cambios",

      createSuccess:
        "Tarea creada correctamente",

      createError:
        "No se pudo crear la tarea",
    },


      profile: {
        title: "Mi perfil",

        noName: "Sin nombre",
        of: "de",

        backToDashboard: "Volver al panel",
        backToProfile: "Volver al perfil",

        information: "Información personal",

        name: "Nombre",
        email: "Correo electrónico",
        emailPlaceholder: "correo@ejemplo.com",

        nameRequired: "El nombre no puede estar vacío.",
        emailRequired: "El correo no puede estar vacío.",

        avatar: "Avatar",
        banner: "Banner",

        changeAvatar: "Cambiar avatar",
        changeBanner: "Cambiar banner",

        editProfile: "Editar perfil",
        saveChanges: "Guardar cambios",
        saving: "Guardando cambios...",

        accountCreated: "Cuenta creada",
        memberSince: "Miembro desde",

        password: "Contraseña",
        changePassword: "Cambiar contraseña",

        newPassword: "Nueva contraseña",
        confirmNewPassword: "Confirmar nueva contraseña",
        repeatNewPassword: "Repite la nueva contraseña",

        showPassword: "Mostrar contraseña",
        hidePassword: "Ocultar contraseña",

        passwordMismatch: "Las contraseñas no coinciden.",
        passwordTooShort: "La contraseña debe tener al menos 6 caracteres.",
        passwordUpdateSuccess: "Contraseña actualizada correctamente.",
        passwordUpdateError: "No se pudo actualizar la contraseña.",

        activitySummary: "Resumen de actividad",
        activitySummaryDescription: "Cómo llevas tus tareas actualmente.",

        totalTasks: "Total de tareas",
        completedTasks: "Tareas completadas",
        pendingTasks: "Tareas pendientes",
        inProgressTasks: "Tareas en progreso",
        productivity: "Productividad",
        overallProgress: "Progreso general",

        noTasks: "Aún no tienes tareas.",
        noActivity: "Todavía no hay actividad.",

        updateSuccess: "Perfil actualizado correctamente.",
        updateError: "No se pudo actualizar el perfil.",

        avatarUpdateSuccess: "Avatar actualizado correctamente.",
        avatarUpdateError: "No se pudo actualizar el avatar.",

        bannerUpdateSuccess: "Banner actualizado correctamente.",
        bannerUpdateError: "No se pudo actualizar el banner.",

        changePasswordDescription:
        "Cambia la contraseña de forma segura",
      },
   
    auth: {
      login: "Iniciar sesión",

      logout: "Cerrar sesión",

      register: "Crear cuenta",

      email: "Correo electrónico",

      password: "Contraseña",

      confirmPassword:
        "Confirmar contraseña",

      forgotPassword:
        "¿Has olvidado tu contraseña?",

      rememberMe:
        "Recordarme",

      loginButton:
        "Entrar",

      registerButton:
        "Registrarse",

      resetPassword:
        "Restablecer contraseña",

      backToLogin:
        "Volver al inicio de sesión",
    },

    authPage: {
        backToHome: "Volver a la página principal",

        registerEyebrow: "Empieza ahora",
        registerTitle: "Crea tu cuenta",
        registerDescription:
          "Organiza tu trabajo, sigue tu progreso y mantén el foco desde un solo lugar.",

        loginEyebrow: "Bienvenido de nuevo",
        loginTitle: "Inicia sesión",
        loginDescription:
          "Accede a tu espacio personal y continúa donde lo dejaste.",

        name: "Nombre",
        namePlaceholder: "Tu nombre",
        emailPlaceholder: "tu@email.com",

        passwordPlaceholder: "Crea una contraseña segura",
        confirmPasswordPlaceholder: "Repite tu contraseña",
        loginPasswordPlaceholder: "Introduce tu contraseña",

        showPassword: "Mostrar contraseña",
        hidePassword: "Ocultar contraseña",

        passwordRequirements: "Tu contraseña debe incluir:",
        minCharacters: "Mínimo 8 caracteres",
        uppercase: "Una mayúscula",
        lowercase: "Una minúscula",
        number: "Un número",
        specialCharacter: "Un carácter especial",

        creatingAccount: "Creando cuenta...",
        signingIn: "Iniciando sesión...",

        alreadyHaveAccount: "¿Ya tienes una cuenta?",
        signInLink: "Inicia sesión",

        dontHaveAccount: "¿Aún no tienes una cuenta?",
        createAccountLink: "Crea una cuenta",

        missingName: "Introduce tu nombre.",
        missingEmail: "Introduce tu correo electrónico.",
        missingPassword: "Introduce una contraseña.",
        passwordRequirementsError:
          "La contraseña no cumple todos los requisitos.",
        passwordMismatch: "Las contraseñas no coinciden.",
        registerError: "No se pudo crear la cuenta.",
        loginError:
          "No se pudo iniciar sesión. Inténtalo de nuevo.",
        heroBadge: "Tu espacio de trabajo",

        loginHeroTitleFirst: "Organiza hoy.",
        loginHeroTitleAccent: "Avanza cada día.",
        loginHeroDescription:
          "Centraliza tus tareas, controla tu progreso y mantén el foco en lo que realmente importa.",

        registerHeroTitleFirst: "Tu trabajo,",
        registerHeroTitleAccent: "más claro y simple.",
        registerHeroDescription:
          "Crea tu cuenta y reúne tareas, objetivos y avances en un único espacio diseñado para ayudarte a concentrarte.",

        heroFeatureOneTitle: "Todo en un mismo lugar.",
        heroFeatureOneDescription:
          "Planifica, organiza y sigue tu progreso con FlowDesk.",

        heroStepOne: "Organiza tus tareas en segundos.",
        heroStepTwo: "Visualiza tu progreso con claridad.",
        heroStepThree: "Mantén el foco en lo importante.",
},
   

    theme: {
      light: "Claro",

      dark: "Oscuro",

      system: "Sistema",

      changeTheme:
        "Cambiar tema",
    },

 

    language: {
      spanish: "Español",

      english: "Inglés",

      changeLanguage:
        "Cambiar idioma",
    },
  },

  // ============================================================
  // INGLÉS
  // ============================================================

  en: {
  

    common: {
      all: "All",
      save: "Save changes",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      close: "Close",
      custom: "Custom",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      loading: "Loading...",
    },

   

    navigation: {
      tasks: "Tasks",
      profile: "My profile",
      dashboard: "Dashboard",
      calendar: "Calendar",
      settings: "Settings",
      logout: "Log out",
    },

   

    userMenu: {
      profile: "My profile",

      profileDescription:
        "View my information",

      editProfile:
        "Edit profile",

      editProfileDescription:
        "Modify my information",

      logout:
        "Sign out",

      logoutDescription:
        "Sign out of my account",
    },


    header: {
      dashboard: "Dashboard",
      tasks: "Tasks",
      calendar: "Calendar",
      profile: "Profile",
      settings: "Settings",
      logout: "Log out",

      language: "Language",
      spanish: "Spanish",
      english: "English",
    },


    dashboard: {
      taskflow: "TaskFlow",

      dashboard: "Dashboard",

      title: "My dashboard",

      description:
        "Organize your tasks, track your progress and improve your productivity.",

      todaySummary:
        "Today's summary",

      welcome:
        "Welcome back! 👋",

      welcomeDescription:
        "Manage your tasks, track your progress and keep everything organized in one place.",

      totalTasks:
        "Total tasks",

      statistics: {
        total: "TOTAL",

        completed: "COMPLETED",

        pending: "PENDING",

        productivity:
          "PRODUCTIVITY",

        createdTasks:
          "Created tasks",

        finishedTasks:
          "Finished tasks",

        pendingTasks:
          "Tasks to complete",
      },

      activity:
        "Activity",

      activityDescription:
        "Summary of your current tasks.",

      summary:
        "Summary",

      summaryDescription:
        "Current status of your tasks.",

      completed:
        "Completed",

      pending:
        "Pending",

      inProgress:
        "In progress",

      highPriority:
        "High priority",

      myTasks:
        "My tasks",

      myTasksDescription:
        "Search, filter and organize your tasks.",

      calendar:
        "Calendar",

      noTasks:
        "No tasks",

      noTasksDescription:
        "Create your first task and start organizing your day with TaskFlow.",

      search:
        "Search tasks...",

      newTask:
        "New task",

      firstStep: "Your first step",

      firstTaskTitle: "Start organizing your day!",

      firstTaskDescription:
        "You do not have any tasks yet. Create your first one, add a date or priority, and make FlowDesk your personal workspace.",

      firstTaskHint:
        "Click the “New task” button at the bottom right.",

      firstTaskFeature: "Add tasks",

      firstPriorityFeature: "Set priorities",

      firstCompleteFeature: "Complete goals",
    },


    filters: {
      status:
        "Task status",

      all:
        "All",

      pending:
        "Pending",

      inProgress:
        "In progress",

      completed:
        "Completed",

      priority:
        "Priority",

      allPriorities:
        "All",

      low:
        "Low",

      medium:
        "Medium",

      high:
        "High",

      sort:
        "Sort by",

      createdAt:
        "Creation date",

      creationDate:
        "Creation date",

      title:
        "Title",

      dueDate:
        "Due date",

      prioritySort:
        "Priority",

      newest:
        "Newest",

      oldest:
        "Oldest",
    },


    tasks: {
      title:
        "Tasks",

      newTask:
        "New task",

      createTask:
        "Create task",

      editTask:
        "Edit task",

      deleteTask:
        "Delete task",

      saveTask:
        "Save task",

      cancel:
        "Cancel",

      move:
        "Move",

      moveTask:
        "Move task",

      viewTask:
        "View task",

      taskDetails:
        "Task details",

      noTasks:
        "No tasks",

      noTasksDescription:
        "You don't have any tasks in this section.",

      searchPlaceholder:
        "Search tasks...",

      titleLabel:
        "Title",

      titlePlaceholder:
        "Enter the task title...",

      descriptionLabel:
        "Description",

      descriptionPlaceholder:
        "Describe the task...",

      priorityLabel:
        "Priority",

      statusLabel:
        "Status",

      dueDateLabel:
        "Due date",

      tagLabel:
        "Tag",

      tagPlaceholder:
        "e.g. Personal",

      createdAt:
        "Created on",

      updatedAt:
        "Updated on",

      overdue:
        "Overdue",

      complete:
        "Complete task",

      markPending:
        "Mark as pending",

      edit:
        "Edit task",

      delete:
        "Delete task",


      confirmDelete:
        "Are you sure you want to delete this task?",

      deleteWarning:
        "This action cannot be undone.",

      emptyBoard:
        "There are no tasks in this status.",

      dragAndDrop:
        "Drag tasks to move them.",

      dragHere:
        "Drag a task here",

      taskSingular: "task",

      taskPlural: "tasks",

      details: {
        title: "Task details",
        description: "Description",
        noDescription: "This task has no description.",
        priority: "Priority",
        status: "Status",
        dueDate: "Due date",
        close: "Close",
        editTask: "Edit task",
        deleteTask: "Delete task",
        pending: "Pending",
        inProgress: "In progress",
        completed: "Completed",
        completeTask: "Complete task",
        markPending: "Mark as pending",
      },

      deleteTitle: "Delete task",

      deleteDescription:
        "Are you sure you want to delete this task? This action cannot be undone.",

      deleting: "Deleting...",

    },
  

    status: {
      pending:
        "Pending",

      inProgress:
        "In progress",

      completed:
        "Completed",

      pendingPlural:
        "Pending",

      inProgressPlural:
        "In progress",

      completedPlural:
        "Completed",
    },



    priority: {
      low:
        "Low",

      medium:
        "Medium",

      high:
        "High",

      lowDescription:
        "Low priority",

      mediumDescription:
        "Medium priority",

      highDescription:
        "High priority",
    },

 

    calendar: {
      title:
        "Calendar",

      subtitle:
        "Due dates for your tasks",

      tasksWithDate:
        "Tasks with a date",

      today:
        "Today",

      previous:
        "Previous",

      next:
        "Next",

      month:
        "Month",

      week:
        "Week",

      day:
        "Day",

      monday:
        "Monday",

      tuesday:
        "Tuesday",

      wednesday:
        "Wednesday",

      thursday:
        "Thursday",

      friday:
        "Friday",

      saturday:
        "Saturday",

      sunday:
        "Sunday",

      january:
        "January",

      february:
        "February",

      march:
        "March",

      april:
        "April",

      may:
        "May",

      june:
        "June",

      july:
        "July",

      august:
        "August",

      september:
        "September",

      october:
        "October",

      november:
        "November",

      december:
        "December",

      noTasks:
        "There are no tasks for this day.",
    },

    board: {
      title:
        "Board",

      pending:
        "Pending",

      inProgress:
        "In progress",

      completed:
        "Completed",

      moveHere:
        "Move here",

      empty:
        "There are no tasks here.",

      dragTask:
        "Drag a task to move it.",

      tasks:
        "tasks",

      task:
        "task",

      drag:
        "Drag task",

      moved:
        "Task moved successfully",

      movedError:
        "The task could not be moved",

      completedMessage:
        "Task completed ✅",

      inProgressMessage:
        "Task in progress 🔵",

      pendingMessage:
        "Task pending 🟡",
        
      orderUpdated: "Order updated",

      undo: "Undo",

      undoSuccess: "Movement undone",

      undoError: "The movement could not be undone",
    },

  
    createTask: {
      title:
        "New task",

      titleLabel:
        "Title",

      titlePlaceholder:
        "Enter the task title...",

      descriptionLabel:
        "Description",

      descriptionPlaceholder:
        "Describe the task...",

      priorityLabel:
        "Priority",

      tagLabel:
        "Tag",

      customTagLabel:
        "Tag name",

      customTagPlaceholder:
        "E.g. Gym, Travel, Project...",

      customTagHelp:
        "You can enter any tag you want.",

      dueDateLabel:
        "Due date",

      createButton:
        "Create task",

      success:
        "Task created successfully",

      error:
        "The task could not be created",
    },

 

    editTask: {
      title:
        "Edit task",

      titleLabel:
        "Title",

      titlePlaceholder:
        "Title...",

      descriptionLabel:
        "Description",

      descriptionPlaceholder:
        "Description...",

      priorityLabel:
        "Priority",

      tagLabel:
        "Tag",

      customTagLabel:
        "Tag name",

      customTagPlaceholder:
        "Enter your tag name...",

      dueDateLabel:
        "Due date",

      saveButton:
        "Save changes",

      success:
        "Changes saved successfully",

      error:
        "The changes could not be saved",
    },

   

    tags: {
      work:
        "Work",

      studies:
        "Studies",

      personal:
        "Personal",

      home:
        "Home",

      custom:
        "Custom",
    },



    form: {
      required:
        "This field is required.",

      invalidTitle:
        "Enter a valid title.",

      invalidDate:
        "Enter a valid date.",

      save:
        "Save",

      create:
        "Create",

      update:
        "Update",

      cancel:
        "Cancel",

      close:
        "Close",

      confirm:
        "Confirm",

      loading:
        "Saving...",

      creating:
        "Creating...",

      updating:
        "Updating...",
    },

  

    messages: {
      taskCreated:
        "Task created successfully.",

      taskUpdated:
        "Task updated successfully.",

      taskDeleted:
        "Task deleted successfully.",

      taskMoved:
        "Task moved successfully.",

      deleteTitle: 
        "Delete task",

      deleteDescription:
        "Are you sure you want to delete this task? This action cannot be undone.",

      deleting:   
        "Deleting...",

      error:
        "An error occurred.",

      genericError:
        "Something went wrong. Please try again.",

      completed:
        "Task completed ✅",

      inProgress:
        "Task in progress 🔵",

      pending:
        "Task pending 🟡",

      movedError:
        "The task could not be moved",

      deleteConfirm:
        "Are you sure you want to delete this task?",

      deleteSuccess:
        "Task deleted successfully",

      deleteError:
        "The task could not be deleted",

      toggleCompleted:
        "Task completed",

      togglePending:
        "Task marked as pending",

      updateError:
        "The task could not be updated",

      saveSuccess:
        "Changes saved successfully",

      saveError:
        "The changes could not be saved",

      createSuccess:
        "Task created successfully",

      createError:
        "The task could not be created",
    },


  profile: {
      title: "My profile",

      noName: "No name",
      of: "of",

      backToDashboard: "Back to dashboard",
      backToProfile: "Back to profile",

      information: "Personal information",

      name: "Name",
      email: "Email",
      emailPlaceholder: "email@example.com",

      nameRequired: "Name cannot be empty.",
      emailRequired: "Email cannot be empty.",

      avatar: "Avatar",
      banner: "Banner",

      changeAvatar: "Change avatar",
      changeBanner: "Change banner",

      editProfile: "Edit profile",
      saveChanges: "Save changes",
      saving: "Saving changes...",

      accountCreated: "Account created",
      memberSince: "Member since",

      password: "Password",
      changePassword: "Change password",

      newPassword: "New password",
      confirmNewPassword: "Confirm new password",
      repeatNewPassword: "Repeat your new password",

      showPassword: "Show password",
      hidePassword: "Hide password",

      passwordMismatch: "Passwords do not match.",
      passwordTooShort: "The password must be at least 6 characters long.",
      passwordUpdateSuccess: "Password updated successfully.",
      passwordUpdateError: "The password could not be updated.",

      activitySummary: "Activity summary",
      activitySummaryDescription: "How your tasks are currently progressing.",

      totalTasks: "Total tasks",
      completedTasks: "Completed tasks",
      pendingTasks: "Pending tasks",
      inProgressTasks: "Tasks in progress",
      productivity: "Productivity",
      overallProgress: "Overall progress",

      noTasks: "You do not have any tasks yet.",
      noActivity: "There is no activity yet.",

      updateSuccess: "Profile updated successfully.",
      updateError: "The profile could not be updated.",

      avatarUpdateSuccess: "Avatar updated successfully.",
      avatarUpdateError: "The avatar could not be updated.",

      bannerUpdateSuccess: "Banner updated successfully.",
      bannerUpdateError: "The banner could not be updated.",

      changePasswordDescription:
      "Change your password securely",
    },

    auth: {
      login:
        "Log in",

      logout:
        "Log out",

      register:
        "Create account",

      email:
        "Email",

      password:
        "Password",

      confirmPassword:
        "Confirm password",

      forgotPassword:
        "Forgot your password?",

      rememberMe:
        "Remember me",

      loginButton:
        "Log in",

      registerButton:
        "Sign up",

      resetPassword:
        "Reset password",

      backToLogin:
        "Back to login",
    },

    authPage: {
        backToHome: "Back to home",

        registerEyebrow: "Get started",
        registerTitle: "Create your account",
        registerDescription:
          "Organize your work, track your progress, and stay focused in one place.",

        loginEyebrow: "Welcome back",
        loginTitle: "Log in",
        loginDescription:
          "Access your personal workspace and continue where you left off.",

        name: "Name",
        namePlaceholder: "Your name",
        emailPlaceholder: "you@email.com",

        passwordPlaceholder: "Create a secure password",
        confirmPasswordPlaceholder: "Repeat your password",
        loginPasswordPlaceholder: "Enter your password",

        showPassword: "Show password",
        hidePassword: "Hide password",

        passwordRequirements: "Your password must include:",
        minCharacters: "At least 8 characters",
        uppercase: "An uppercase letter",
        lowercase: "A lowercase letter",
        number: "A number",
        specialCharacter: "A special character",

        creatingAccount: "Creating account...",
        signingIn: "Signing in...",

        alreadyHaveAccount: "Already have an account?",
        signInLink: "Log in",

        dontHaveAccount: "Don't have an account yet?",
        createAccountLink: "Create an account",

        missingName: "Enter your name.",
        missingEmail: "Enter your email address.",
        missingPassword: "Enter a password.",
        passwordRequirementsError:
          "The password does not meet all requirements.",
        passwordMismatch: "Passwords do not match.",
        registerError: "Could not create the account.",
        loginError:
          "Could not sign in. Please try again.",

        heroBadge: "Your workspace",

          loginHeroTitleFirst: "Organize today.",
          loginHeroTitleAccent: "Make progress every day.",
          loginHeroDescription:
            "Keep your tasks in one place, track your progress, and stay focused on what truly matters.",

          registerHeroTitleFirst: "Your work,",
          registerHeroTitleAccent: "clearer and simpler.",
          registerHeroDescription:
            "Create your account and keep tasks, goals, and progress together in one focused workspace designed to help you stay on track.",

          heroFeatureOneTitle: "Everything in one place.",
          heroFeatureOneDescription:
            "Plan, organize, and track your progress with FlowDesk.",

          heroStepOne: "Organize your tasks in seconds.",
          heroStepTwo: "See your progress clearly.",
          heroStepThree: "Stay focused on what matters.",
    },

    theme: {
      light:
        "Light",

      dark:
        "Dark",

      system:
        "System",

      changeTheme:
        "Change theme",
    },



    language: {
      spanish:
        "Spanish",

      english:
        "English",

      changeLanguage:
        "Change language",
    },
  },
} as const;