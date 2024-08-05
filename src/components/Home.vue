<template>
  <div class="container">
    <div class="d-flex" v-if="token">
      <button class="btn btn-outline-danger ms-auto" @click="signOut">
        Cerrar Sesión
      </button>
    </div>
    <div class="row">
      <div class="col">
        <h1>Matrix Rotation</h1>
        <form @submit.prevent="rotateMatrix">
          <textarea
            v-model="matrixInput"
            placeholder="Enter matrix as JSON"
            style="width: 25%; min-height: 150px"
            required
            class="form-control d-inline"
          ></textarea>
          <br />
          <button type="submit" class="btn btn-outline-success">
            QR Matrix
          </button>
        </form>
      </div>
      <div class="col">
        <h2>Formato de Envío de Datos de Matriz</h2>
        <p>[ </p>
        <p>[10, 102, 0],</p>
        <p>[20, 0, 30] </p>
        <p>]</p>
      </div>
    </div>
<hr>
    <div class="row">
      <div class="col-md-6">
        <div v-if="rotatedMatrix">
          <h2>QR Matrix:</h2>
          <p><b>Q:</b>{{ rotatedMatrix.Q }}</p>
          <p><b>R:</b>{{ rotatedMatrix.R }}</p>
        </div>
      </div>
      <div class="col-md-3">
        <div v-if="statisticsRotate">
          <h2>Statistics Rotate:</h2>
          <pre>{{ statisticsRotate }}</pre>
        </div>
      </div>
      <div class="col-md-3">
        <div v-if="statisticsMatrix">
          <h2>Statistics:</h2>
          <pre>{{ statisticsMatrix }}</pre>
        </div>
      </div>
    </div>
    <div
      v-if="alert.show"
      class="alert alert-danger alert-dismissible fade show mt-2 mx-auto col-2"
      role="alert"
    >
      {{ alert.message }}<br />
      <p><a href="/login">Iniciar Session</a></p>
      <button
        type="button"
        class="btn-close"
        @click="alert.show = false"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script>
import apiGo from "../apiGo";
import apiNode from "../apiNode";

export default {
  name: "HomePage",

  data() {
    return {
      matrixInput: "",
      rotatedMatrix: null,
      statisticsRotate: null,
      statisticsMatrix: null,
      alert: {
        show: false,
        message: "",
      },
      token: null,
    };
  },
  mounted() {
    this.token = localStorage.getItem("token");
  },
  methods: {
    async rotateMatrix() {
      try {
        this.alert.show = false;
        // Asegúrate de que this.matrixInput es una cadena JSON válida.
        let matrix;
        try {
          matrix = JSON.parse(this.matrixInput);
        } catch (parseError) {
          // Si hay un error al parsear, muestra una alerta y termina la función
          this.showAlert(
            "Invalid JSON format. Please enter a valid JSON matrix."
          );
          return;
        }

        // Realiza la solicitud para rotar la matriz
        const rotateResponse = await apiGo.post(
          "/get-qr",
          { matrix },
          { headers: { Authorization: this.token } }
        );
        this.rotatedMatrix = rotateResponse.data;

        // Realiza la solicitud para obtener estadísticas

        const statsResponse = await apiGo.post(
          "/rotate-statistics",
          { matrix: matrix },
          { headers: { Authorization: this.token } }
        );
        this.statisticsRotate = statsResponse.data;

        const statsResponses = await apiNode.post(
          "/calculate-statistics",
          { matrix: matrix },
          { headers: { Authorization: this.token } }
        );
        this.statisticsMatrix = statsResponses.data;
      } catch (error) {
        console.error("Error processing matrix:", error); //imprimir esto en un snackbar
        const errorMessage =
          error.response?.data?.error || "An unknown error occurred";

        // Llama a `showAlert` solo si `errorMessage` tiene un valor
        if (errorMessage) {
          this.showAlert(errorMessage);
        }
      }
    },
    showAlert(message) {
      this.alert.message = message;
      this.alert.show = true;
    },
    signOut() {
      localStorage.removeItem("token"); // Elimina el token del almacenamiento local
      this.$router.push("/login");
    },
  },
};
</script>

