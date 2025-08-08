// src/hooks/useChapaApi.ts
import { chapaService, InitializePaymentRequest, InitiateTransferRequest, Bank } from '@/services/chapa-api';
import { useAsyncApi } from './useApiCall';

// Hook for initializing a payment
export const useInitializePayment = () => {
  return useAsyncApi<any, [InitializePaymentRequest]>(chapaService.initializePayment);
};

// Hook for getting a list of banks
export const useGetBanks = () => {
  return useAsyncApi<Bank[], []>(chapaService.getBanks);
};

// Hook for initiating a transfer
export const useInitiateTransfer = () => {
  return useAsyncApi<any, [InitiateTransferRequest]>(chapaService.initiateTransfer);
};

// Hook for verifying a payment
export const useVerifyPayment = () => {
  return useAsyncApi<any, [string]>(chapaService.verifyPayment);
};