const routes = [
  {
    path: "/",
    component: () => import("layouts/Inicio.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },
  {
    path: "/projeto",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/Sobre/Projeto.vue"),
      },
      {
        path: "setup",
        component: () => import("src/pages/Projeto/Setup.vue"),
      },
      {
        path: "principal",
        component: () => import("src/pages/Projeto/Principal.vue"),
      },
    ],
  },
  {
    path: "/disciplina",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/Sobre/Disciplina.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
