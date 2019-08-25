<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/">
        <a class="navbar-brand" href="#"> Construtor </a>
      </router-link>

      <button
        v-on:click="abreOpcao()"
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="navbar-collapse" id="navbarText">
        <!---->
        <ul class="navbar-nav mr-auto">
          <!--
          <li class="nav-item active">
            <router-link to="/about"><a class="nav-link" href="#"> Minhas contas <span class="sr-only">(current)</span></a></router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/contas">
              <a class="nav-link" href="#">Inicio</a>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/contas">
              <a class="nav-link" href="#">Contas a Pagar</a>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/contas">
              <a class="nav-link" href="#">Contas a Receber</a>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/contas">
              <a class="nav-link" href="#">Cartoes</a>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/contas">
              <a class="nav-link" href="#">Categorias</a>
            </router-link>
          </li>
          -->
        </ul>
        
        <!--
        <a class="nav-link" href="#" v-on:click="Logout()">Logout</a>
        -->

      </div>
    </nav>

    <div class="container">
      <!-- class="container" -->
      <router-view />
    </div>
  </div>
</template>