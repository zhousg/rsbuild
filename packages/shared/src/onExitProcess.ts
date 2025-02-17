export function onExitProcess(listener: NodeJS.ExitListener) {
  process.on('exit', listener);

  // listen to 'SIGINT' and trigger a exit
  // 'SIGINT' from the terminal is supported on all platforms, and can usually be generated with Ctrl + C
  process.on('SIGINT', () => {
    process.exit(0);
  });
}
