// trello.js
// Drag & drop карточек и списков внутри доски

document.addEventListener("DOMContentLoaded", function () {
  // Drag & drop карточек
  document.querySelectorAll(".card").forEach(card => {
    card.draggable = true;
    card.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("cardId", card.dataset.cardId);
      e.dataTransfer.setData("fromListId", card.closest(".cards-container").dataset.listId);
    });
  });

  document.querySelectorAll(".cards-container").forEach(container => {
    container.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    container.addEventListener("drop", function (e) {
      e.preventDefault();
      const cardId = e.dataTransfer.getData("cardId");
      const fromListId = e.dataTransfer.getData("fromListId");
      const toListId = container.dataset.listId;
      const token = localStorage.getItem("authToken");
      if (fromListId !== toListId) {
        fetch(`/api/cards/${cardId}/move/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + token
          },
          body: JSON.stringify({ list: toListId })
        }).then(() => window.location.reload());
      }
    });
  });

  // Drag & drop списков (колонок)
  document.querySelectorAll(".list-column").forEach(listColumn => {
    listColumn.draggable = true;
    listColumn.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("listId", listColumn.dataset.listId);
    });
  });

  document.querySelectorAll(".lists-container").forEach(listsCont => {
    listsCont.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    listsCont.addEventListener("drop", function (e) {
      e.preventDefault();
      const listId = e.dataTransfer.getData("listId");
      const token = localStorage.getItem("authToken");
      fetch(`/api/lists/${listId}/reorder/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + token
        },
        body: JSON.stringify({ order: 0 })
      }).then(() => window.location.reload());
    });
  });
});
