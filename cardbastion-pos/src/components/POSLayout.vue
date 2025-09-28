.layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
  background-color: #0D0D0D;
}

.left-panel {
  flex: 2;
  padding: 2rem;
  overflow-y: auto;
  background-color: #1E1E1E;
  border-right: 2px solid #F2B138;
  color: #fff;
}

.right-panel {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #282828;
  color: #fff;
}

.title {
  font-size: 24px;
  color: #F2B138;
}

.product-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #F2B138;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.product-card button {
  margin-top: 0.5rem;
  background-color: #F29A2E;
  color: black;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .left-panel, .right-panel {
    flex: unset;
    width: 100%;
    height: auto;
  }
}
