export interface Token {
  mint: string;
  name: string;
  symbol: string;
  balance: number;
  decimals: number;
  uiAmount: number;
  image: string | null;
}

export interface WalletContextType {
  address: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}
