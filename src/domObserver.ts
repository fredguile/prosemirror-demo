export default new MutationObserver(mutationList =>
  console.log(
    mutationList.reduce(
      (acc, { addedNodes, removedNodes }) => ({
        added: acc.added + addedNodes.length,
        removed: acc.removed + removedNodes.length
      }),
      { added: 0, removed: 0 }
    )
  )
);
