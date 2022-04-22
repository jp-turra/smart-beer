const routes = [
  {
    path: "/",
    component: () => import("layouts/Inicio.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "projeto", component: () => import("pages/Projeto.vue") },
      { path: "disciplina", component: () => import("pages/Disciplina.vue") },
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
